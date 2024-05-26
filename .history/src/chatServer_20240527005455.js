const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const port = 6969;
const server = http.createServer(express);
const wss = new WebSocket.Server({server})

wss.on('connection', function connection(ws){
    ws.on('message', function incoming(data){
        wss.client.forEach(function each(client){
            if(client != ws && client.readyState == WebSocket.OPEN){
                client.send(data);
            }
        })
    })
})
