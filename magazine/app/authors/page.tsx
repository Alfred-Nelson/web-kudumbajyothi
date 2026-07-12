import React from 'react'
import APIS from '@/sanity/api'
import { AuthorSearchList } from './AuthorSearchList';

const AuthorsPage = async () => {
    // Initial fetch for the first 10 authors
    const initialAuthors = await APIS.searchAuthors("*", 0, 10);

    return (
        <section className="bg-white">
            <div className="pt-32 bg-black/95 pb-8 px-(--gutter-width) text-white font-family-uroob text-7xl">
                ലേഖകർ
            </div>

            <div className="px-(--gutter-width) py-10">
                <AuthorSearchList initialAuthors={initialAuthors || []} />
            </div>
        </section>
    )
}

export default AuthorsPage;