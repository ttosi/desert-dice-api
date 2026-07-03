To create database diagram:
install 

sqlite3 desert-dice.db -init sqlite-schema-diagram.sql "" > schema.dot && dot -Tsvg schema.dot > schema.svg

