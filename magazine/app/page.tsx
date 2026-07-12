import APIS from "@/sanity/api";
import Layout1 from "./components/layouts/One";
import Layout2 from "./components/layouts/Two";
import { LayoutKindType, LayoutPropsType } from "@/sanity/general_types";
import Layout3 from "./components/layouts/Three";
import Layout5 from "./components/layouts/Five";
import Layout6 from "./components/layouts/Six";

const ApplyLayout = <T,>({ type, ...props }: LayoutPropsType<T> & { type: LayoutKindType }) => {
  if (type === "layout1") {
    return <Layout1 {...props} />
  } else if (type === "layout2") {
    return <Layout2 {...props} />
  } else if (type === "layout3") {
    return <Layout3 {...props} />
  } else if (type === "layout4") {
    return <Layout1 {...props} />
  } else if (type === "layout5") {
    return <Layout5 {...props} />
  } else if (type === "layout6") {
    return <Layout6 {...props} />
  }
}

export default async function Home() {
  const config = await APIS.getConfig()

  if (!config || Array.isArray(config)) {
    throw new Error("Kindly set up the config")
  }

  return (
    <main className="mt-24 wrap-break-word space-y-8">
      {config.sections?.map((section) => {

        if (section._type === "collectionSection") {
          return (<ApplyLayout
            key={section._key}
            items={section.collection?.layoutArticles!}
            heading={(item) => item.malayalamTitle}
            image={(item) => item.mainImage}
            link={(item) => `/articles/${item.slug?.current}`}
            description={(item) => item.description}
            subDescription={(item) => `–– ${item.author?.malayalamName} ––`}
            type={section.layout!}
            title={section.showTitle ? section.collection?.malayalamTitle! : ""}
          />)
        }

        if (section._type === "authorsSection") {
          return (
            <ApplyLayout
              key={section._key}
              items={section.authors!}
              heading={(item) => item.malayalamName}
              link={(item) => `/authors/${item.slug?.current}`}
              image={(item) => item.profileImage}
              type={section.layout!}
              title={section.showTitle ? "ലേഖകർ" : ""}
            />
          )
        }

        if (section._type === "regularsSection") {
          return (
            <ApplyLayout
              key={section._key}
              items={section.regulars!}
              heading={(item) => item.malayalamTitle}
              description={(item) => item.description}
              image={(item) => item.coverImage}
              link={(item) => `/regulars/${item.slug?.current}`}
              subDescription={(item) => {
                const count = item.parts?.length
                return (`${count || 0} article${count === 1 ? "" : "s"}`)
              }}
              type={section.layout!}
              title={section.showTitle ? "പംക്തികൾ" : ""}
            />
          );
        }
      })}
    </main>
  );
}
