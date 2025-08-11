jQuery(function($) {
    $.getJSON('file.json', function(times) {
        $('.prayerTimesExample')
            .append('Today in ' + times.title)
            .append(' Fajr: ' + times.items[0].fajr)
            .append(' Dhuhr: ' + times.items[0].dhuhr)
            .append(' Asr: ' + times.items[0].asr)
            .append(' Maghrib: ' + times.items[0].maghrib)
            .append(' Isha: ' + times.items[0].isha)
            .append(' by MuslimSalat.com');
    });
});

