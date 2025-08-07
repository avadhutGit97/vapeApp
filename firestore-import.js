import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

// Get command line arguments
// Usage: node firestore-import.js data.json import --project=your-project-id --service-account-key=./serviceAccountKey.json

const args = process.argv.slice(2);

const dataFile = args[0];               // e.g. data.json
const action = args[1];                 // 'import' (we only handle import here)
const projectIdArg = args.find(arg => arg.startsWith('--project='));
const serviceAccountArg = args.find(arg => arg.startsWith('--service-account-key='));

if (!dataFile || !action || !projectIdArg || !serviceAccountArg) {
  console.error('Usage: node firestore-import.js <data.json> import --project=<project-id> --service-account-key=<path-to-key.json>');
  process.exit(1);
}

const projectId = projectIdArg.split('=')[1];
const serviceAccountKeyPath = serviceAccountArg.split('=')[1];

// Read and parse the service account JSON
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountKeyPath, 'utf8'));

// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount),
  projectId: projectId,
});

const db = getFirestore();

async function importData() {
  // Read JSON data file
  const jsonData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

  // jsonData should be an object: { collectionName: { docId: { ...docData } } }
  for (const collectionName in jsonData) {
    const collectionData = jsonData[collectionName];
    const collectionRef = db.collection(collectionName);

    for (const docId in collectionData) {
      const docData = collectionData[docId];
      try {
        await collectionRef.doc(docId).set(docData);
        console.log(`Imported doc ${docId} into collection ${collectionName}`);
      } catch (err) {
        console.error(`Failed to import doc ${docId} in ${collectionName}:`, err);
      }
    }
  }

  console.log('Import complete.');
}

async function main() {
  if (action === 'import') {
    await importData();
  } else {
    console.error(`Unknown action: ${action}. Only 'import' is supported.`);
  }
}

main().catch(console.error);
