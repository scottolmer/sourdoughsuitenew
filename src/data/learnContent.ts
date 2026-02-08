export interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    youtubeId: string;
    category: 'Technique' | 'Recipe' | 'Science' | 'Q&A';
    duration: string;
    publishDate: string;
    featured?: boolean;
}

export const learnContent: Video[] = [
    {
        id: '1',
        title: 'Mastering the Coil Fold',
        description: 'Learn the gentle technique to build structure without degassing your dough.',
        thumbnail: 'https://img.youtube.com/vi/HlJEjW-QSnQ/maxresdefault.jpg',
        youtubeId: 'HlJEjW-QSnQ',
        category: 'Technique',
        duration: '5:24',
        publishDate: '2025-01-15',
        featured: true,
    },
    {
        id: '2',
        title: 'The Perfect Country Loaf',
        description: 'A step-by-step guide to baking a classic country sourdough bread.',
        thumbnail: 'https://img.youtube.com/vi/2FVfJtgpXnU/maxresdefault.jpg',
        youtubeId: '2FVfJtgpXnU',
        category: 'Recipe',
        duration: '12:10',
        publishDate: '2024-12-20',
    },
    {
        id: '3',
        title: 'Understanding Fermentation',
        description: 'Why do we ferment? The science behind the flavor and texture.',
        thumbnail: 'https://img.youtube.com/vi/ZqKE-Jd7a7g/maxresdefault.jpg',
        youtubeId: 'ZqKE-Jd7a7g', // Placeholder ID
        category: 'Science',
        duration: '8:45',
        publishDate: '2024-11-05',
    },
    {
        id: '4',
        title: 'Maintaining Your Starter',
        description: 'Keep your starter active and healthy with these feeding tips.',
        thumbnail: 'https://img.youtube.com/vi/mHRh1i4l2Sg/maxresdefault.jpg',
        youtubeId: 'mHRh1i4l2Sg', // Placeholder ID
        category: 'Technique',
        duration: '6:30',
        publishDate: '2024-10-15',
    },
];
