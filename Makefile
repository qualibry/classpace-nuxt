DC=docker-compose
STORAGES=docker-compose/storage.yml
PRODFILE=docker-compose.yaml
CALL_CONTAINER_IT=docker exec -it classroom-notifications
RUN_TEST=poetry run pytest

.PHONY: network
network:
	docker network create classroom-network

.PHONY: prod
prod:
	${DC} -f ${PRODFILE} up --build -d

.PHONY: dev
dev:
	npm install && npm run dev

.PHONY: logs
logs:
	${DC} -f ${PRODFILE} logs -f

.PHONY: stop
stop:
	${DC} -f ${PRODFILE} stop
