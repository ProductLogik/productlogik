import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

engine = create_engine("postgresql://postgres:postgres@localhost:5432/productlogik")
Session = sessionmaker(bind=engine)
session = Session()

result = session.execute(text("""SELECT u.id, a.themes_json, a.agile_risks_json 
                            FROM uploads u JOIN analysis_results a ON u.id = a.upload_id 
                            WHERE u.status = 'completed' LIMIT 5""")).fetchall()

for row in result:
    print(f"Row {row[0]}:")
    print(f"Themes: {row[1]}")
    print(f"Agile: {row[2]}")
    print("---")
