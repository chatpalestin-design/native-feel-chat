# Radiant Connect

[١٥/‏٨, ٩:٥٤ م] pq: لقد راجعتُ كود الموقع المرجعي قبل الرد، لذا إليك تفاصيل مكوناته:

الواجهة الأمامية: React 18، تم بناؤها باستخدام Create React App وwebpack. تستخدم الواجهة Framework7 (إصدار React)، مما يجعلها تبدو كتطبيق جوال أصلي. كما تستخدم MobX لإدارة الحالة، وi18next لللغتين العربية والإنجليزية واللغات التي تُكتب من اليمين إلى اليسار، وaxios لاستدعاءات واجهة برمجة التطبيقات باستخدام رموز JWT، وHls.js لبث الراديو، وLottie للرسوم المتحركة، وSwiper للشرائح. يمكن تثبيته كتطبيق ويب تقدمي (PWA). تعمل المراسلة الفورية عبر اتصال WebSocket عادي، وليس Socket.IO أو Firebase.

[١٥/‏٨, ٩:٥٥ م] pq: إليك كيفية بناء هذه النسخة:

الواجهة الأمامية: React (تطبيق صفحة واحدة/تطبيق ويب تقدمي)، Framework7 لواجهة المستخدم المصممة للهواتف، MobX لإدارة الحالة، i18next للترجمة العربية/اللغة التي تُكتب من اليمين إلى اليسار، مُدمجة في Webpack.

التواصل الفوري: WebSockets أصلي (وليس Firebase/Pusher).

واجهة برمجة التطبيقات: REST ضمن /api/v4/.

السمة: Blueberry v2.6.

لذا، فإنّ البنية التقنية المطابقة لإعادة إنشائها بدقة هي:

React + Framework7 + Node.js + WebSockets + قاعدة بيانات (MongoDB/MySQL).

علغه نودي

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3e7d335f-2452-4896-82c9-acc509f635a7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
