import Image from "next/image";
import APIS from "@/sanity/api";
import { urlFor } from "@/sanity/image";
import { Article } from "@/sanity/types";
import Link from "next/link";

export default async function Home() {

  const collection = await APIS.getCollections()
  // const featured = collection.find(each => each.slug?.current === "featured")
  // const featuredArticles = featured?.articles?.map((article: Article) => {
  //   const imgUrl = urlFor(article.mainImage?.file)?.width(1920).height(1080).url()
  //   return { ...article, mainImage: { ...article.mainImage, url: imgUrl } }
  // })

  const formattedCollection = collection.map(each => {
    const articles = each.articles?.map((article: Article) => {
      const imgUrl = !!article.mainImage ? urlFor(article.mainImage?.file)?.width(1920).height(1080).url() : null
      return { ...article, mainImage: article.mainImage ? { ...article.mainImage, url: imgUrl } : null }
    })
    return { ...each, articles }
  })

  return (
    <main className="mt-20">
      {formattedCollection.map(each => {
        return (
          <div key={each._id}>
            <div className="text-4xl font-bold pt-6">{each.title}</div>
            <div className="grid grid-cols-3 w-full mt-(--gutter-width) gap-(--gutter-width)">
              {each.articles?.map(article => (
                <Link key={article._id} href={"/articles/" + article._id}>
                  <span className="block w-full h-120 rounded-md overflow-hidden relative group bg-stone-700">
                    {!!article.mainImage && (<Image src={article.mainImage.url} alt={article.mainImage.alt || "image of article"} fill className="object-cover group-hover:scale-120 transition ease-in-out duration-300" />)}
                    <span className="block h-fit w-full absolute bottom-0 left-0 bg-gradient-to-t from-black/90 via-80% via-black/60 to-transparent group-hover:bg-black/60 transition ease-in-out z-5">
                      <span className="z-10 block relative text-center text-balance bottom-0 px-(--gutter-width) py-4 text-white">
                        <h3 className="text-2xl font-bold mb-3">{article.malayalamTitle}</h3>
                        <p>{article.description}<span className="inline">{" "}Read More {">"}</span></p>
                      </span>
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </main>
  );
}
