# docker run -dp 3000:3000 pjame \
# -e NUXT_PUBLIC_GEO_IP_URL="https://geoip-map.rtarf-prod.its-software-services.com/" \
# -e NUXT_PUBLIC_MACHINE_STATUS_URL="https://uptime-kuma.rtarf-prod.its-software-services.com/dashboard/?dummy=1" \
# -e NUXT_API_PATH="test1234" \
# -e NUXT_PUBLIC_BASE_URL="https://localhost" \
# -e NUXT_KEYCLOAK_IDP_ENDPOINT="https://keycloak.devops.napbiotec.io/auth/realms/rtarf-ads-dev/protocol/openid-connect/token" \
# -e NUXT_KEYCLOAK_IDP_CLIENT_ID="mrdjs" \
# -e NUXT_KEYCLOAK_IDP_CLIENT_SECRET="hkZyyHdHHLyXQqJzgfPGN97Vt9xr8ZoL" \


# docker run -dp 3000:3000 \
# -e NUXT_PUBLIC_GEO_IP_URL='https://geoip-map.rtarf-prod.its-software-services.com' \
# -e NUXT_PUBLIC_MACHINE_STATUS_URL='https://uptime-kuma.rtarf-prod.its-software-services.com/dashboard/?dummy=1' \
# -e NUXT_API_PATH='test1234' \
# -e NUXT_PUBLIC_BASE_URL='https://localhost" \
# -e NUXT_KEYCLOAK_IDP_ENDPOINT='https://keycloak.devops.napbiotec.io/auth/realms/rtarf-ads-dev/protocol/openid-connect/token' \
# -e NUXT_KEYCLOAK_IDP_CLIENT_ID='mrdjs' \
# -e NUXT_KEYCLOAK_IDP_CLIENT_SECRET='hkZyyHdHHLyXQqJzgfPGN97Vt9xr8ZoL' \
# --name pjame pjame

docker run -dp 3000:3000 \
-e NUXT_PUBLIC_GEO_IP_URL='https://geoip-map.rtarf-prod.its-software-services.com' \
-e NUXT_PUBLIC_MACHINE_STATUS_URL='https://uptime-kuma.rtarf-prod.its-software-services.com/dashboard/?dummy=1' \
-e NUXT_API_PATH='test1234' \
-e NUXT_PUBLIC_BASE_URL='https://localhost' \
-e NUXT_KEYCLOAK_IDP_ENDPOINT='https://keycloak.devops.napbiotec.io/auth/realms/rtarf-ads-dev/protocol/openid-connect/token' \
-e NUXT_KEYCLOAK_IDP_CLIENT_ID='mrdjs' \
-e NUXT_KEYCLOAK_IDP_CLIENT_SECRET='hkZyyHdHHLyXQqJzgfPGN97Vt9xr8ZoL' \
--name pjame pjame