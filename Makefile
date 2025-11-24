start_db:
	docker-compose up -d

stop_db:
	docker-compose down

create_migration:
	db-migrate create ${n} --sql-file
 
.PHONEY: start_db stop_db