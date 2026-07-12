import React from 'react'
import APIS from '@/sanity/api'
import { ArticleSearchList } from './ArticlesSearchList'

const ArticlesPage = async () => {
    const initialArticles = await APIS.searchArticles("*", 0, 12);

    return (
        <section className="bg-white">
            <div className="pt-32 bg-black/95 pb-8 px-(--gutter-width) text-white font-family-uroob text-7xl">
                ലേഖനങ്ങൾ
            </div>

            <div className="px-(--gutter-width) py-10">
                <ArticleSearchList initialArticles={initialArticles || []} />
            </div>
        </section>
    )
}

export default ArticlesPage;