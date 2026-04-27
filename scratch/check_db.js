const { createClient } = require('@supabase/supabase-client');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBlogs() {
  const { data, error, count } = await supabase
    .from('blogs')
    .select('*', { count: 'exact' });
  
  if (error) {
    console.error('Error fetching blogs:', error);
  } else {
    console.log('Total blogs count:', count);
    console.log('Blogs data:', JSON.stringify(data, null, 2));
  }
}

checkBlogs();
