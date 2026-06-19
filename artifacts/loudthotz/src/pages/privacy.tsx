import { useSiteSettings } from "@/lib/firestore";

const DEFAULT_POLICY = `This Privacy Policy governs the manner in which Nigerian Poems and Writing Poetry collects, uses, maintains and discloses information collected from users (each, a "User") of the http://loudthotzpoetry.blogspot.com/ website ("Site").

## Personal Identification Information
We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, fill out a form, and in connection with other activities, services, features or resources we make available on our Site. Users may be asked for, as appropriate, their email address. We will collect personal identification information from Users only if they voluntarily submit such information to us. Users can always refuse to supply personally identification information, except that it may prevent them from engaging in certain Site-related activities.

## Non-Personal Identification Information
We may collect non-personal identification information about Users whenever they interact with our Site. Non-personal identification information may include the browser name, the type of computer and technical information about Users' means of connection to our Site, such as the operating system and the Internet service providers utilised and other similar information.

## Web Browser Cookies
Our Site may use "cookies" to enhance User experience. User's web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. User may choose to set their web browser to refuse cookies, or to alert you when cookies are being sent. If they do so, note that some parts of the Site may not function properly.

## How We Use Collected Information
Nigerian Poems and Writing Poetry may collect and use Users' personal information for the following purposes:

### To run and operate our Site
We may need your information to display content on the Site correctly.

### To personalise user experience
We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site.

### To send periodic emails
We may use the email address to respond to their inquiries, questions, and/or other requests.

## How We Protect Your Information
We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorised access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site.

## Sharing Your Personal Information
We do not sell, trade, or rent Users' personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above.

## Electronic Newsletters
If a User decides to opt-in to our mailing list, they will receive emails that may include company news, updates, related product or service information, etc.

## Third Party Websites
Users may find advertising or other content on our Site that link to the sites and services of our partners, suppliers, advertisers, sponsors, licencors and other third parties. We do not control the content or links that appear on these sites and are not responsible for the practices employed by websites linked to or from our Site. In addition, these sites or services, including their content and links, may be constantly changing. These sites and services may have their own privacy policies and customer service policies. Browsing and interaction on any other website, including websites which have a link to our Site, is subject to that website's own terms and policies.

## Advertising
Ads appearing on our site may be delivered to Users by advertising partners, who may set cookies. These cookies allow the ad server to recognise your computer each time they send you an online advertisement to compile non-personal identification information about you or others who use your computer. This information allows ad networks to, among other things, deliver targeted advertisements that they believe will be of most interest to you. This privacy policy does not cover the use of cookies by any advertisers.

## Google AdSense
Some of the ads may be served by Google. Google's use of the DART cookie enables it to serve ads to Users based on their visit to our Site and other sites on the Internet. DART uses "non-personally identifiable information" and does NOT track personal information about you, such as your name, email address, physical address, etc. You may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy at http://www.google.com/privacy_ads.html.

## Changes to This Privacy Policy
Nigerian Poems and Writing Poetry has the discretion to update this privacy policy at any time. When we do, we will post a notification on the main page of our Site and revise the updated date at the bottom of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.

## Your Acceptance of These Terms
By using this Site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Site. Your continued use of the Site following the posting of changes to this policy will be deemed your acceptance of those changes.

## Contacting Us
If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us.`;

function renderPolicyText(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let paraBuffer: string[] = [];

  const flushPara = (key: string) => {
    const content = paraBuffer.join(" ").trim();
    if (content) {
      elements.push(
        <p key={key} className="text-gray-400 leading-relaxed text-sm">
          {content}
        </p>
      );
    }
    paraBuffer = [];
  };

  lines.forEach((line, i) => {
    const key = String(i);
    if (line.startsWith("## ")) {
      flushPara(`p-${i}`);
      elements.push(
        <h2 key={key} className="text-lg font-bold text-white mt-8 mb-2 first:mt-0">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushPara(`p-${i}`);
      elements.push(
        <div key={key} className="pl-4 border-l border-white/10 mb-2">
          <p className="text-sm font-semibold text-gray-300">{line.slice(4)}</p>
        </div>
      );
    } else if (line.trim() === "") {
      flushPara(`p-${i}`);
    } else {
      paraBuffer.push(line);
    }
  });
  flushPara("p-end");
  return elements;
}

export default function PrivacyPolicy() {
  const { data: s, loading } = useSiteSettings();

  const policyText = s?.privacyPolicyText || DEFAULT_POLICY;
  const updatedAt = s?.privacyPolicyUpdatedAt || "August 18, 2015";

  return (
    <div className="min-h-screen bg-[#070906]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Legal</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-500 text-sm">This document was last updated on {updatedAt}</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 rounded bg-white/[0.03] animate-pulse" style={{ width: `${70 + (i % 3) * 10}%` }} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {renderPolicyText(policyText)}
          </div>
        )}

        <div className="border-t border-white/5 pt-8 mt-12">
          <p className="text-xs text-gray-600">This document was last updated on {updatedAt}</p>
        </div>
      </div>
    </div>
  );
}
