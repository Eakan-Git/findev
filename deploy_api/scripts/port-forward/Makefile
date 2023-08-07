.PHONY: server
server:
	@echo "Port forwarding to server"

	@echo "FastAPI Swagger UI available at http://localhost:8001/api/server/docs"

	kubectl -n development port-forward svc/server-service 8001:8001

.PHONY: cv
cv:
	@echo "Port forwarding to cv"

	@echo "FastAPI Swagger UI available at http://localhost:8002/api/cv/docs"

	kubectl -n development port-forward svc/cv-service 8002:8001

.PHONY: elastic
elastic:
	@echo "Port forwarding to elasticsearch"

	@echo "Elasticsearch available at http://localhost:9200/"

	kubectl -n elasticsearch port-forward svc/elastic-service 9200:9200
