from database import SessionLocal
from sqlalchemy import text
import sys

def fix_database_constraints():
    db = SessionLocal()
    try:
        print("--- Migrating Usage Quotas Constraints ---")
        
        # 1. Drop existing constraint if it exists
        # In Postgres, the constraint name is usually table_name_column_name_check
        constraint_name = "usage_quotas_plan_tier_check"
        print(f"Dropping existing constraint: {constraint_name}...")
        
        db.execute(text(f"ALTER TABLE usage_quotas DROP CONSTRAINT IF EXISTS {constraint_name}"))
        
        # 2. Add new constraint with allowed tiers: demo, pro, team, enterprise
        print("Adding new constraint with tiers: demo, pro, team, enterprise...")
        db.execute(text("""
            ALTER TABLE usage_quotas 
            ADD CONSTRAINT usage_quotas_plan_tier_check 
            CHECK (plan_tier IN ('demo', 'pro', 'team', 'enterprise'))
        """))
        
        # 3. Update any existing 'free' entries to 'demo' just in case
        print("Migrating 'free' tier to 'demo'...")
        db.execute(text("UPDATE usage_quotas SET plan_tier = 'demo' WHERE plan_tier = 'free'"))
        
        db.commit()
        print("[SUCCESS] Database constraints synchronized with commercial tiers.")
        return True
    except Exception as e:
        db.rollback()
        print(f"[FAILED] Migration failed: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    if fix_database_constraints():
        sys.exit(0)
    else:
        sys.exit(1)
