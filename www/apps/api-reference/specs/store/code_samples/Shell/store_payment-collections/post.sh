curl -X POST '{backend_url}/store/payment-collections' \
-H 'Content-Type: application/json' \
--data-raw '{
  "cart_id": "{value}",
  "region_id": "{value}",
  "currency_code": "{value}",
  "amount": 8468325826822144
}'