
async function testArchive() {
    console.log('Testing archive API...');
    try {
        const response = await fetch('http://localhost:5173/api/archive', {
            method: 'POST',
            body: JSON.stringify({ type: 'skill', id: 'test-skill' }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            console.log('Archive request successful');
        } else {
            console.error('Archive request failed:', response.status, response.statusText);
            const text = await response.text();
            console.error('Response:', text);
        }
    } catch (error) {
        console.error('Error calling archive API:', error);
    }
}

testArchive();
