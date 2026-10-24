#!/bin/bash
TOKEN=$(curl -s --max-time 5 -X POST http://localhost:3008/api/auth/login -H "Content-Type: application/json" -d '{"password":"EEric2625."}' | sed 's/.*"token":"\([^"]*\)".*/\1/')
echo "Token: ${TOKEN:0:50}..."
curl -s --max-time 10 -X POST http://localhost:3008/api/aura-admin/chat -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"message":"test"}' 2>&1
