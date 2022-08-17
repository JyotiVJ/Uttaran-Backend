module.exports = {
    allowMimeType: ['image/jpeg', 'image/png', 'application/pdf','video/mp4', 'image/svg'],
    profile_photo_url: '/uploads/profile_images',
    songs_url: '/uploads/songs',
    event_cover_image: `/uploads/events`,
    podcasts_url: '/uploads/podcasts',
    podcasts_cover_url : '/uploads/podcast_image',
    podcasts_cover_image_url : '/uploads/podcast_image',
    album_cover_url: '/uploads/albums',
    album_song_url: '/uploads/albums_songs',
    social_event_img_url: '/uploads/social_events',
    jwtAccessTokenOptions: {
        secret: 'KawawaMusicApp#@2021',
        options: {
            algorithm: 'HS256',
            expiresIn: '7d',
            audience: 'aud:Kawawa',
            issuer: 'Kawawa-' + process.env.GIT_BRANCH + '-' + (process.env.NODE_ENV == 'development' ? 'DEV' : 'PROD') + '@' + require('os').hostname()
        }
    },
    jwtRefreshTokenOptions: {
        secret: 'KawawaMusicApp#@2021',
        options: {
            algorithm: 'HS256',
            expiresIn: '3d',
            audience: 'aud:Kawawa',
            issuer: 'Kawawa-' + process.env.GIT_BRANCH + '-' + (process.env.NODE_ENV == 'development' ? 'DEV' : 'PROD') + '@' + require('os').hostname()
        }
    },
}
