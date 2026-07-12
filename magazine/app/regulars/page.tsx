import React from "react";
import APIS from "@/sanity/api";
import { RegularsSearchList } from "./RegularsSearchList";

const RegularsPage = async () => {
    const initialRegulars = await APIS.searchRegulars("*", 0, 10);

    return (
        <section className="bg-white">
            {/* HEADER */}
            <div className="pt-32 bg-black/95 pb-8 px-(--gutter-width) text-white font-family-uroob text-7xl">
                പരമ്പരകൾ
            </div>

            {/* LIST */}
            <div className="px-(--gutter-width) py-10">
                <RegularsSearchList initialRegulars={initialRegulars || []} />
            </div>
        </section>
    );
};

export default RegularsPage;