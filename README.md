dev server starting 

pnpm exec cap sync android
pnpm exec cap run android --live-reload --port=4000

// get sh1
cd android 
./gradlew signingReport
