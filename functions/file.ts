export default {
    async fetch(request: { url: string | URL; method: any; body: any; }, env: { ZAUNMAP_BUCKET: { put: (key: string, value: ReadableStream|ArrayBuffer|ArrayBufferView|string|null|Blob) => Promise<R2Object|null>; get: (key: string) => Promise<R2ObjectBody|null>; delete: (keys: string|string[]) => Promise<void>; }; }) {
        const url = new URL(request.url);
        const user_id = url.searchParams.get("user_id")
    
        switch (request.method) {
            case 'POST':
                var object_id = crypto.randomUUID()
                var key = `${user_id}/${object_id}`;
                await env.ZAUNMAP_BUCKET.put(key, request.body);
                return new Response(JSON.stringify({'status': true, 'object_id': object_id}), {status: 201, headers: {'Content-Type': 'application/json'}});
            case 'PUT':
                var object_id = url.searchParams.get('object_id')
                var key = `${user_id}/${object_id}`;
                await env.ZAUNMAP_BUCKET.put(key, request.body);
                return new Response(`Put ${key} successfully!`);
            case 'GET':
                var object_id = url.searchParams.get('object_id')
                var key = `${user_id}/${object_id}`;
                const object = await env.ZAUNMAP_BUCKET.get(key);
        
                if (object === null) {
                    return new Response('Object Not Found', { status: 404 });
                }
        
                const headers = new Headers();
                object.writeHttpMetadata(headers);
                headers.set('etag', object.httpEtag);
        
                return new Response(object.body, {
                    headers,
                });
            case 'DELETE':
                var object_id = url.searchParams.get('object_id')
                var key = `${user_id}/${object_id}`;
                await env.ZAUNMAP_BUCKET.delete(key);
                return new Response('Deleted!');
    
            default:
                return new Response('Method Not Allowed', {
                    status: 405,
                    headers: {
                    Allow: 'PUT, GET, DELETE, POST',
                    },
                });
        }
    },
  };