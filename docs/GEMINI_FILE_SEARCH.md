# MED DZ — Gemini File Search

This integration adds a curated, read-only community knowledge index powered by Gemini File Search. It is not a relational database and it is not permanent binary-file storage.

## What it does

- Creates one MED DZ File Search store using `models/gemini-embedding-2`.
- Indexes approved PDFs, images and text files with MED DZ metadata.
- Supports semantic Q&A through `/api/library/search`.
- Returns available grounding source details with answers.
- Keeps all Gemini credentials and the admin token on the server.

## Important retention and privacy limits

Google's current File Search documentation says indexed embeddings persist until manually deleted, while temporary original files uploaded through the Gemini Files API are deleted after 48 hours. Therefore MED DZ must retain the original downloadable file in separate object storage before enabling community uploads or promising long-term downloads. Do not treat File Search as a document-download archive.

Only the owner can index into the shared store. The endpoint requires an explicit `rightsConfirmed: true` and `personalDataChecked: true` confirmation. AI classification alone is not legal permission to redistribute a document. Student uploads remain local and are not automatically published.

## Server environment variables

Set these only in the hosting provider's server environment:

- `GEMINI_API_KEY`: existing Gemini API key.
- `GEMINI_FILE_SEARCH_STORE`: full resource name returned by the create-store endpoint, for example `fileSearchStores/...`.
- `MED_DZ_LIBRARY_ADMIN_TOKEN`: a long, random, private owner token. Never put it in frontend code, GitHub, or a public URL.

## Provision the store

1. Set `MED_DZ_LIBRARY_ADMIN_TOKEN` on the server.
2. Call `POST /api/admin/library/create-store` with header `x-med-dz-admin-token: <token>`.
3. Copy the returned `storeName` into the server environment variable `GEMINI_FILE_SEARCH_STORE`.
4. Restart the server and check `GET /api/library/status`.

The create-store endpoint refuses to create another store when `GEMINI_FILE_SEARCH_STORE` is already set.

## Owner-only document indexing

Call `POST /api/admin/library/index-document` with the admin header and JSON fields:

- `fileName`, `mimeType`, `fileBase64`
- `rightsConfirmed: true`
- `personalDataChecked: true`
- optional `metadata`: `documentType`, `specialty`, `university`, `academicYear`, `language`, `rightsBasis`

Supported MIME types: PDF, PNG, JPEG, WEBP and plain text. Maximum decoded size: 13 MiB.

A successful response is returned only after Google reports indexing complete. A pending response is not success; check before retrying to avoid duplicate indexing.

## Search

Call `POST /api/library/search` with JSON `{ "question": "..." }`. This endpoint is read-only and searches the configured shared store. It does not expose the admin token.

## Current implementation boundary

This is a backend foundation only. The existing student document library still saves uploads locally in IndexedDB and continues using the current direct-document Gemini workflows. Do not connect student uploads to the shared store until MED DZ has authenticated accounts, permanent object storage, owner moderation, deletion synchronization and a clear rights-review workflow.

## Cost note

Google currently lists File Search storage and retrieval as free, with embedding creation charged at indexing time and retrieved document tokens charged at the selected Gemini model's normal input rate. Quotas and prices can change; review Google's live pricing before production use.
