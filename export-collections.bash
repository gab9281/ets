#!/bin/bash

DB_NAME="evaluetonsavoir"
OUTPUT_DIR="/data/db"

collections=$(mongosh $DB_NAME --quiet --eval "db.getCollectionNames().join(' ')")

for collection in $collections; do
  mongoexport --db=$DB_NAME --collection=$collection --out=$OUTPUT_DIR/$collection.json --jsonArray
done
