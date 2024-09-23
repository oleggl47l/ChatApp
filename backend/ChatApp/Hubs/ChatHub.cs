﻿using System.Text.Json;
using ChatApp.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;

namespace ChatApp.Hubs;

public interface IChatClient {
    public Task ReceiveMessage(string userName, string message);
}

public class ChatHub(IDistributedCache cache) : Hub<IChatClient> {
    public async Task JoinChat(UserConnection connection) {
        await Groups.AddToGroupAsync(Context.ConnectionId, connection.ChatRoom);

        var stringConnection = JsonSerializer.Serialize(connection);

        await cache.SetStringAsync(Context.ConnectionId, stringConnection);

        await Clients
            .Group(connection.ChatRoom)
            .ReceiveMessage("Admin", $"{connection.UserName} joined the chat");
    }

    public async Task SendMessage(string message) {
        var stringConnection = await cache.GetAsync(Context.ConnectionId);

        var connection = JsonSerializer.Deserialize<UserConnection>(stringConnection);

        if (connection is not null) {
            await Clients
                .Group(connection.ChatRoom)
                .ReceiveMessage(connection.UserName, message);
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception) {
        var stringConnection = await cache.GetAsync(Context.ConnectionId);

        var connection = JsonSerializer.Deserialize<UserConnection>(stringConnection);

        if (connection is not null) {
            await cache.RemoveAsync(Context.ConnectionId);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, connection.ChatRoom);

            await Clients
                .Group(connection.ChatRoom)
                .ReceiveMessage("Admin", $"{connection.UserName} left the chat");
        }
    }
}