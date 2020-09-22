#!/bin/bash

API="http://localhost:4741"
URL_PATH="/cards-create"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Authorization: Bearer ${TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{
    "cards": {
      "category": "edibles",
      "name": "'"${NAME}"'",
      "address": "'"${ADDRESS}"'",
      "phone": "'"${PHONE}"'",
      "email": "'"${EMAIL}"'",
      "url": "'"${URL}"'"
    }
  }'

echo
