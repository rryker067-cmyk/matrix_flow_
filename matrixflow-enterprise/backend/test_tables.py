from sqlalchemy import inspect

from app.core.database import engine


inspector = inspect(engine)

tables = inspector.get_table_names()

for table in sorted(tables):
    print(table)