DC=docker-compose
PRODFILE=docker-compose.yaml


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
