interface Env {
	ZAUNMAP_BUCKET: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const url = new URL(context.request.url);
    const user_id = url.searchParams.get("user_id")
    
    switch (context.request.method) {
        case 'POST':
            var object_id = crypto.randomUUID()
            var key = `${user_id}/${object_id}`;
            await context.env.ZAUNMAP_BUCKET.put(key, context.request.body, {httpMetadata: {contentType: context.request.headers.get('Content-Type')}});
            return new Response(JSON.stringify({'status': true, 'object_id': object_id}), {status: 201, headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}});
        case 'PUT':
            var object_id = url.searchParams.get('object_id')
            var key = `${user_id}/${object_id}`;
            await context.env.ZAUNMAP_BUCKET.put(key, context.request.body, {httpMetadata: {contentType: context.request.headers.get('Content-Type')}});
            return new Response(`Put ${key} successfully!`, {status: 200, headers: {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'}});
        case 'GET':
            var object_id = url.searchParams.get('object_id')
            var key = `${user_id}/${object_id}`;
            const object = await context.env.ZAUNMAP_BUCKET.get(key);
    
            if (object === null) {
                return new Response('Object Not Found', { status: 404 });
            }
        
            const headers = new Headers();
            object.writeHttpMetadata(headers);
            headers.set('etag', object.httpEtag);
            headers.set('Access-Control-Allow-Origin', '*');
        
            return new Response(object.body, {
                headers,
            });
        case 'DELETE':
            var object_id = url.searchParams.get('object_id')
            var key = `${user_id}/${object_id}`;
            await context.env.ZAUNMAP_BUCKET.delete(key);
            return new Response('Deleted!');
        case 'OPTIONS':
            return new Response(null, {
                headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT, GET, DELETE, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                },
            });
    
        default:
            return new Response('Method Not Allowed', {
                status: 405,
                headers: {
                Allow: 'PUT, GET, DELETE, POST, OPTIONS',
                },
            });
    }
};
