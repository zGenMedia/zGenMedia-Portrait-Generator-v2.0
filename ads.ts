export interface Ad {
    imageUrl: string;
    linkUrl: string;
}

// Banner placed at the top of the main content area
export const topLeaderboardAds: Ad[] = [
    {
        imageUrl: 'https://blkcosmo.com/wp-content/uploads/2025/02/Black-and-White-Modern-New-Collection-Fashion-Instagram-Post-Leaderboard-ad.png',
        linkUrl: 'https://www.amazon.com/shop/blackcosmopolitan/list/KB55L25J8VFJ?ref_=aip_sf_list_spv_ons_mixed_d'
    }
    // Add more top leaderboard ads here in the future
];

// Banner placed between the generation button and the results section
export const bottomLeaderboardAds: Ad[] = [
     {
        imageUrl: 'https://blkcosmo.com/wp-content/uploads/2025/06/Red-and-Blue-Modern-Professional-Business-Service-Advertising-Instagram-Post.png',
        linkUrl: 'https://zgenmedia.com/'
    }
    // Add more bottom leaderboard ads here in the future
];

// Note: The popupAds array is for modals, not banners.
export const popupAds: Ad[] = [
    {
        imageUrl: 'https://blkcosmo.com/wp-content/uploads/2025/02/50-off-square-ad.png',
        linkUrl: 'https://www.amazon.com/shop/blackcosmopolitan'
    }
];
