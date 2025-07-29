/// <reference lib="WebWorker" />
import { skipWaiting, clientsClaim } from "workbox-core"
import { precacheAndRoute } from "workbox-precaching";

declare const self: ServiceWorkerGlobalScope

precacheAndRoute(self.__WB_MANIFEST);
skipWaiting();
clientsClaim();

console.log("Started the Occupancy Map service");

self.addEventListener("fetch", async (event) => {
    const m = await caches.match(event.request);
    console.log(m);
    event.respondWith(m ? m : new Response(null, { status: 404, statusText: 'Not Found'}));
});

self.addEventListener('install', () => {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', () => {
  console.log('Service Worker activating.');
});
