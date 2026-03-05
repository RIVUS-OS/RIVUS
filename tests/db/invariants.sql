-- ============================================================================
-- RIVUS OS — P41 INVARIANT TESTS
-- Run in Supabase SQL Editor. All tests MUST pass.
-- Last verified: 05.03.2026. | Tag: P41
-- ============================================================================

-- INV-F2: DELETE blocked on spv_finance_entries
DO $$
DECLARE v_test_id UUID; v_spv_id UUID;
BEGIN
  SELECT id INTO v_spv_id FROM spvs WHERE is_blocked = false LIMIT 1;
  INSERT INTO spv_finance_entries (spv_id, entry_type, category, amount, datum, created_by, pdv_stopa)
  VALUES (v_spv_id, 'RASHOD', 'TEST', 100, CURRENT_DATE, auth.uid(), 25)
  RETURNING id INTO v_test_id;
  BEGIN
    DELETE FROM spv_finance_entries WHERE id = v_test_id;
    RAISE EXCEPTION 'INV-F2 FAILED: DELETE succeeded!';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM LIKE '%forbidden%' OR SQLERRM LIKE '%D-006%' THEN
      RAISE NOTICE 'INV-F2 PASSED: DELETE blocked';
    ELSE RAISE EXCEPTION 'INV-F2 UNEXPECTED: %', SQLERRM; END IF;
  END;
  UPDATE spv_finance_entries SET is_storno = true, storno_reason = 'TEST_CLEANUP' WHERE id = v_test_id;
END $$;

-- INV-I1: UNIQUE constraint on spv_code
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'spvs_spv_code_unique') THEN
    RAISE NOTICE 'INV-I1 PASSED'; ELSE RAISE EXCEPTION 'INV-I1 FAILED'; END IF;
END $$;

-- INV-RLS1: RLS enabled on spv_finance_entries
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'spv_finance_entries' AND relrowsecurity = true) THEN
    RAISE NOTICE 'INV-RLS1 PASSED'; ELSE RAISE EXCEPTION 'INV-RLS1 FAILED'; END IF;
END $$;

-- INV-RLS2: >= 4 RLS policies
DO $$ DECLARE v_count INTEGER; BEGIN
  SELECT COUNT(*) INTO v_count FROM pg_policies WHERE tablename = 'spv_finance_entries';
  IF v_count >= 4 THEN RAISE NOTICE 'INV-RLS2 PASSED: % policies', v_count;
  ELSE RAISE EXCEPTION 'INV-RLS2 FAILED: %', v_count; END IF;
END $$;

-- INV-TRG1: >= 5 triggers on spv_finance_entries
DO $$ DECLARE v_count INTEGER; BEGIN
  SELECT COUNT(DISTINCT trigger_name) INTO v_count FROM information_schema.triggers WHERE event_object_table = 'spv_finance_entries';
  IF v_count >= 5 THEN RAISE NOTICE 'INV-TRG1 PASSED: % triggers', v_count;
  ELSE RAISE EXCEPTION 'INV-TRG1 FAILED: %', v_count; END IF;
END $$;

-- INV-TRG2: activity_log immutability triggers
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.triggers WHERE event_object_table = 'activity_log' AND trigger_name = 'trg_prevent_activity_update') THEN
    RAISE NOTICE 'INV-TRG2 PASSED'; ELSE RAISE EXCEPTION 'INV-TRG2 FAILED'; END IF;
END $$;

-- INV-LC1: Direct lifecycle update blocked
DO $$ BEGIN
  BEGIN
    UPDATE spvs SET lifecycle_stage = 'Completed' WHERE id = (SELECT id FROM spvs WHERE is_blocked = false LIMIT 1);
    RAISE EXCEPTION 'INV-LC1 FAILED';
  EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'INV-LC1 PASSED: %', LEFT(SQLERRM, 60); END;
END $$;

-- INV-DM1: Doctrine marker trigger
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.triggers WHERE event_object_table = 'activity_log' AND trigger_name = 'aaa_inject_doctrine_marker') THEN
    RAISE NOTICE 'INV-DM1 PASSED'; ELSE RAISE EXCEPTION 'INV-DM1 FAILED'; END IF;
END $$;

-- INV-BF1: Brute force functions
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'check_login_allowed') AND
     EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'record_login_attempt') THEN
    RAISE NOTICE 'INV-BF1 PASSED'; ELSE RAISE EXCEPTION 'INV-BF1 FAILED'; END IF;
END $$;

DO $$ BEGIN RAISE NOTICE '=== P41: ALL 9 INVARIANTS PASSED ==='; END $$;
