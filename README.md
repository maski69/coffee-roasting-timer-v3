# coffeer-oasting-timer-v3
Coffee Roasting Timer v3.1 - "Easily time your roast and track your development time with standard targets."
My thanks to the original developer coffeeroastingtimer.
The app has some additions that I found necessary to my roasting. I hope people find them useful as well.

## CSV export behavior

Each completed roast is saved as the current pending export.
When you click Export CSV, the app downloads a CSV for that pending roast and then clears it from browser storage.
If you roast again, the next export will contain only that new roast.
