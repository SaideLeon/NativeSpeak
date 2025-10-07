#!/bin/bash

# URL base da API
API_URL="https://nativespeak.cognick.qzz.io/api"

# Dados do usuário
FIRST_NAME="Saide"
LAST_NAME="Suaia"
EMAIL="omarsuaiasaideleon@gmail.com"
PASSWORD="Damasco12"

echo "➡ Registrando usuário (pode falhar se já existir)..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/register/" \
  -H "Content-Type: application/json" \
  -d "{
    \"first_name\": \"$FIRST_NAME\",
    \"last_name\": \"$LAST_NAME\",
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"password2\": \"$PASSWORD\",
    \"terms\": true
  }")
echo "Resposta do registro: $REGISTER_RESPONSE"

echo -e "\n➡ Fazendo login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/login/" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

# Extrair o token access usando jq (necessário instalar jq: sudo apt install jq)
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access')
echo "Token de acesso obtido: $ACCESS_TOKEN"

echo -e "\n➡ Consultando dados do usuário com /me/..."
ME_RESPONSE=$(curl -s -X GET "$API_URL/me/" \
  -H "Authorization: Bearer $ACCESS_TOKEN")
echo "Dados do usuário:"
echo "$ME_RESPONSE"
