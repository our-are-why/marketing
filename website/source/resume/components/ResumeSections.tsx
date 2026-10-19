import {
  HEADER_LABELED__DocumentSection,
} from "./DocumentSection/HEADER_LABELED__DocumentSection.tsx";
// import { INSTITUTION_LABELED__DocumentSection } from "./DocumentSection/INSTITUTION_LABELED__DocumentSection.tsx";
import {
  JOB_LABELED__DocumentSection,
} from "./DocumentSection/JOB_LABELED__DocumentSection.tsx";
import {
  LIFE_LABELED__DocumentSection,
} from "./DocumentSection/LIFE_LABELED__DocumentSection.tsx";
import {
  TRAVEL_LABELED__DocumentSection,
} from "./DocumentSection/TRAVEL_LABELED__DocumentSection.tsx";

export function ResumeHeader() {
  return (
    <HEADER_LABELED__DocumentSection
      fullName="jared mathews"
      emailAddress="our.are.why@gmail.com"
      briefText="someone who seeks out life and lives it; a solid overall\all-around software engineer with an expertise in communicating the semantics of code"
      statusText="adapting and participating"
      shortTerm_goalText="maximize my learning\listening while staying open to abrasive/threatening perspectives"
      longTerm_goalText="continue to hone my craft while exchanging positive energy and ideas with all kinds of folks"
      personDescriptors={["ex-homeless"]}
    />
  );
}

export function ResumeSections() {
  return (
    <>
      <ResumeHeader />
      {/* <INSTITUTION_LABELED__DocumentSection
        lifestyleName="institutionalized"
        roleName="charge"
        facilityStays={[
          {
            facilityName: "psychiatric hospital",
            stayLength: "~ six weeks",
            dateRange: "2026.01 - 2025.11",
          },
          {
            facilityName: "jail",
            stayLength: "~ four weeks",
            dateRange: "2023.08 - 2023.07",
          },
          {
            facilityName: "mental health facility",
            stayLength: "~ one week",
            dateRange: "2021.03",
          },
        ]}
        lifeLearnings={[
          "patience",
          "the tenuousness of freedom",
          "the lack of due diligence, oversight, and accountability in the mental health system",
          "the spectrum and extremes of mental health",
          "how underappreciated and overworked public defenders are",
          "a person can survive 30+ days on water alone",
        ]}
      /> */}
      <LIFE_LABELED__DocumentSection
        lifestyleName="homeless"
        roleName="vagabond"
        dateRange="2025.01 - 2024.07"
        overviewText="roughly six and a half months living\sleeping on the streets across several cities & states (san francisco/san jose, boston/new york, las vegas, and fort collins)"
        lifeLearnings={[
          "a clear sense of what matters",
          "survival and resourcefulness",
          "resilience through hardship",
          "empathy for people on the margins",
          "the inhumanity of the drug/fentanyl crisis",
          "the toll of exposure on mental and physical health",
          "old man winter shows no mercy",
        ]}
      />
      <TRAVEL_LABELED__DocumentSection
        regionName="latin america"
        roleName="nomad"
        dateRanges={["2024.04 - 2021.04", "2018.09 - 2018.07"]}
        overviewText="about two years of living & learning throughout latin america over the span of three years (plus a summer in the dominican republic in 2018)"
        regionTrips={[
          {
            countryNames: "mexico",
            cityNames: "león",
            dateRange: "2024.04 - 2024.03",
          },
          {
            countryNames: "peru, bolivia, paraguay & argentina",
            cityNames: "lima, cusco, la paz, buenos aires",
            dateRange: "2024.03 - 2023.11",
          },
          {
            countryNames: "mexico",
            cityNames: "guadalajara, león",
            dateRange: "2023.06 - 2023.01",
          },
          {
            countryNames: "mexico",
            cityNames: "san cristóbal de las casas, guadalajara, guanajuato",
            dateRange: "2022.12 - 2022.06",
          },
          {
            countryNames: "mexico",
            cityNames: "san cristóbal de las casas, ciudad de méxico",
            dateRange: "2021.08 - 2021.04",
          },
          {
            countryNames: "dominican republic",
            cityNames: "las terrenas",
            dateRange: "2018.09 - 2018.07",
          },
        ]}
        lifeLearnings={[
          "a more holistic, slower way of life",
          "the importance of family",
          "abuelas have that food game on lock",
          "buses are awesome",
          "poor communication hinders",
          "less red tape can help incubate culture and small local businesses",
          "laws are more like guidelines lol",
          "homelessness is less rampant and visceral in latin cultures",
          "an appreciation for public amenities in the usa (libraries, parks, facilities, infrastructure, etc.)",
        ]}
      />
      {/* <JOB_LABELED__DocumentSection
        companyName="stews.io"
        teamName="product"
        jobTitle="ceo/lead"
        dateRange="2023.08 - 2022.08"
        productDescription="a web app that empowers individuals to carve out their own little corner on the web by helping them catalog content that is meaningful to them"
        workResponsibilities={[
          "design user interface and app architecture",
          "implement component library and core app logic while providing a healthy developer experience",
          "manage roadmap and issue prioritization",
        ]}
        techStack={["preact", "typescript", "scss", "git", "liqe"]}
      /> */}
      <JOB_LABELED__DocumentSection
        companyName="wyyerd intuition"
        teamName="engineering"
        jobTitle="frontend developer"
        dateRange="2022.06 - 2022.02"
        productDescription="a web app aimed at internet service providers that assists employees in scheduling and completing a variety of tasks ranging from managing network infrastructure to analyzing client subscriptions"        
        workResponsibilities={[
          "provide thorough code reviews with an emphasis on iteration",
          "refactor a number of entrenched components in order to enable a requested feature or fix an outstanding bug while minimizing breaking changes to existing apis",
          "adapt third-party component libraries to support undocumented use-cases",
          "participate in establishing best practices for frontend development with a focus on component composition that is fairly formulaic in implementation and resulted in code that was more straightforward to reason about",
          "participate in sprint planning and issue prioritization",
          "collaborate with teammates on problems where unobvious or unique solutions were required",
        ]}
        techStack={[
          "vue@2",
          "apollo",
          "bootstrap",
          "playwright",
          "typescript",
          "scss",
          "graphql",
          "git",
        ]}
      />
      <JOB_LABELED__DocumentSection
        companyName="native roots"
        teamName="operations"
        jobTitle="frontend developer"
        dateRange="2021.04 - 2020.12"
        productDescription="two unique web stores each serving their own market of cannabis consumers either in colorado, united states or manitoba, canada"      
        workResponsibilities={[
          "provide clients with a simpler less error-prone purchase flow",
          "revive an abandoned and brittle nextjs codebase",
          "stabilize repository via typescript, more comprehensive e2e tests, simpler environment/dependency management, and a modernized palette of development scripts for a streamlined workflow",
          "migrate from shopify api to dutchie plus api for a smoother cannabis shopping experience",
          "resolve outstanding wcag 2.1 level aa and ada title iii accessibility lawsuit",
        ]}
        techStack={[
          "nextjs",
          "react",
          "typescript",
          "graphql",
          "nodejs",
          "cypress",
          "firebase",
          "git",
        ]}
      />
      <JOB_LABELED__DocumentSection
        companyName="confident cannabis"
        teamName="wholesale"
        jobTitle="junior developer"
        dateRange="2020.04 - 2019.05"
        productDescription="a b2b marketplace/network that helps licensed businesses in the cannabis industry manage and transact tested inventory"
        workResponsibilities={[
          "empower clients by simplifying their operations in a tightly regulated industry",
          "improve experience around order creation/management",
          "collaborate with teammates on monthly milestones",
          "identify, describe, and patch bugs",
          "maintain, design, and implement react forms/inputs",
          "maintain, design, and implement react hooks",
          "maintain and refactor legacy react components",
        ]}
        techStack={[
          "react",
          "typescript",
          "material-ui",
          "redux",
          "storybook",
          "git",
        ]}
      />
      <JOB_LABELED__DocumentSection
        companyName="datasplice"
        teamName="research & development"
        jobTitle="apprentice developer"
        dateRange="2018.05 - 2016.05"
        productDescription="an offline-first/mobile-first web app that helps enterprise organize, navigate, and manipulate data regardless of location"
        workResponsibilities={[
          "collaborate with teammates towards providing clients with a flexible and reliable platform for assisting workers out in the field",
          "identify, describe, and patch bugs",
          "maintain and integrate bluetooth hardware for cordova ios extension",
          "design and implement a robust component for marking-up/annotating images on the fly",
          "maintain, design, and implement a shared react components library",
          "begin refactor of core app functionality towards improved readability/testability by way of redux-saga",
        ]}
        techStack={[
          "react",
          "redux",
          "redux-saga",
          "cordova",
          "coffeescript",
          "git",
        ]}
      />
      {/* <ResumeSchoolSection
        schoolName="galvanize"
        programName="fullstack web development"
        dateRange="2016.04 - 2015.10"
        programDescription="an immersive six-month bootcamp that covered technologies, patterns, and best-practices applied throughout industry"
        techStack={[
          "javascript",
          "nodejs",
          "git",
          "css",
          "express",
          "postgresql",
        ]}
      /> */}
    </>
  );
}
