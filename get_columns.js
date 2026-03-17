const { createClient } = require('@supabase/supabase-js');
// Load env
require('dotenv').config({ path: 'apps/bio-intranet/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if(!supabaseUrl || !supabaseKey) {
  console.log("Missing env variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('event_calls')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Error fetching event_calls:", error);
  } else if (data && data.length > 0) {
    console.log("Columns:", Object.keys(data[0]));
  } else {
    console.log("No data found to inspect columns");
  }
}

run();
