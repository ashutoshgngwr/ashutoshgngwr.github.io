---
date: 2021-06-12 23:38:22 +0530
image: false
layout: post
mathjax: false
tags: internet social-media social-networking mental-health disinformation politics
title: Attempts at solving the online social media
---

After graduating in 2019, I've always been mindful of my social media
consumption. I had permanently deleted Facebook and Instagram accounts. I've
been keeping search and watch histories paused on YouTube. It depersonalises the
video recommendations. And I barely check Twitter as I find it emotionally
expensive. So last year, when [Ravi Soni](https://ravisoni.dev) proposed that we
try to solve the social media, I didn't need convincing to join him. I
understood that we were setting ourselves up for failure. But I also think that
it is one of the most urgent problems of the 21st century.

## Core problems with present social media

We started discussing what we were building sometime towards the end of August
2020\. During the discussions, we came across many problems. We focused on some
while ignoring others for the time being. For brevity, I am organising them into
a few coherent classes.

### Mental health

We are a social species. We need social validation and acceptance to thrive. The
problem occurs when we seek too much of it, and social media helps us maximise
it. Furthermore, it presents us with metrics such as the likes count. We use
this data to paint a self-portrait from others' outlook. We try to optimise our
online behaviour based on our inference. As a result, we exhibit narcissistic
personality traits.[^1]

Social media helped us monetise, and so we did. We monetised our lives, kids,
pets and even our acts of kindness.[^2] If it's happening, it's happening in
front of a camera. We wouldn't have to look far to find people who display
distinct behaviour online and in real life. Everyone behaves a little different
under the scope of social media. But the distinction in behaviour is
pathological for some.

### Disinformation, filter bubbles and political influence

Disinformation is a threat in general. And social media is an effective tool for
spreading disinformation. But social media can not cause this problem.[^3]
Neither does the problem have a technological solution. It is also simply not
realistic to fact-check everything we come across.

Yet, social media causes an enormous problem by producing information bubbles.
Mainstream services use recommender systems to generate personalised content
feeds. The system guesses what information we would like to see based on our
history. While a recommender system boosts user engagement, it has a critical
side-effect. It effectively isolates us from counter viewpoints. And thus, it
can (and does) polarise us to the extremes of our ideologies.[^4]

### Standard operating procedure for businesses

Businesses are amoral and optimise for revenue. Companies that offer software
services for free earn revenue through advertisements.[^5] They social-engineer
products to be more engaging and advertiser-friendly to maximise revenue. The
strive for higher user engagement made social media chronically addictive.
Optimal advertisement placement causes the abuse of our private information.[^6]
Social media companies imposed a very high cost to the little their products
promised - a tool to share personal updates with the people we know.

## Finding solutions

After some lengthy discussions, our efforts
yielded [HymnFeed](https://hymnfeed.social/). While working on it, we also
participated in [Y Combinator's 4-week build
sprint](https://blog.ycombinator.com/announcing-yc-build-sprint-and-20-equity-free-grants/).
Although we couldn't build a functional demo in time, it had the following
fundamental features on paper.

### No influential metrics

It is perhaps the most addictive feature of the present social media. We agreed
to remove the like, comment and share counts straight away. Removing them breaks
the social validation feedback loop. If a user wants a count, they could see a
list of users (or comments on a post) and count manually. Recently, [Instagram
also added a feature to turn off the likes
count](https://techcrunch.com/2021/04/14/instagrams-new-test-lets-you-choose-if-you-want-to-hide-likes-facebook-test-to-follow/).

### Infinite scroll but with a natural chronology

We decided not to prioritise items in a user's content feed. Instead, we decided
to use its chronological order. It ensures that content feeds don't create
filter bubbles. We did not want to guess what a user might like; we wanted them
to decide it.

### Consumable post tokens

Ravi came up with the concept of consumable tokens. When a user signs up, they
get a fixed amount of tokens. Users can neither buy nor transfer these. They
consume these tokens by posting on the network. On spending their tokens, users
will lose their ability to post. This flow limits the amount of content a user
generates. And so, it compels users to be more thoughtful of how to spend these.
It is analogous to the philosophy of life: you've got limited time, so spend it
wisely.

## Starting over from scratch

We addressed most of the problems we were trying to solve. Yet, we couldn't
figure out a way to monetise the product. Advertisement based business models
only work with highly engaging products. What we had was intentionally dull in
contrast to present social media. We could try to boost its user engagement. But
for us, that meant creating another Facebook, so it was pointless.

By the end of September 2020, we decided to pull the plug on HymnFeed. Ravi
moved on to work at [SuperTokens](https://supertokens.io/) while I shifted my
focus to a different project. Some time towards the end of November 2020, I
rebooted the project from scratch as [Soir](https://getsoir.com/). I carried
forward the ideas we had discussed so far. But before considering these ideas, I
started with the very basics.

### Establishing boundaries

The free flow of information is necessary for a society. But social media
shouldn't be the tool for propagating socio-political information.[^7] Instead,
it should limit such opinions to circles where a friendly debate is viable, i.e.
among the people we know. If one needs to expand their audience, they can seek
other media targeting specific cohorts, e.g. blogs. Soir had WhatsApp like
contact synchronisation to emulate this model. If a person is not in your
contacts, you will not interact with them on the network. You can only view
their profiles and exchange comments through a mutual friend's post.

### Replacing the like count with the view count

Should we care who likes what we posted on social media? An entire genre of
philosophy says otherwise. In an ideal world, I shouldn't even need the view
count. However, I decided to keep the view count. I believe it can help in
sensing the audience response similar to the like count. And unlike the like
button, it doesn't cause too much dopamine secretion.

### Reconsidering consumable post tokens

Too much engagement is harmful; too little feels dull. Consumable tokens are a
sweet compromise between the two. But unlike HymnFeed, Soir would have two
sections. One dedicated for content from the contacts. And another one for
hosting the public content. Posting on the public feed would need tokens, and
reaching out to your contacts wouldn't.

## So, where's the demo?

I stopped working on the demo in March 2021. I'm giving it another go now,
picking off right where I left. I took a break because of the two dreadful
questions that killed HymnFeed.

### How will it make money?

Adopting an existing business model will imply adopting their issues. We know
that social media and conventional advertising don't fit well together. For a
while, I was considering a subscription-based service model. But free social
media have become a standard. I am exploring some alternatives, but everything
is theoretical at this point.

### The cost of switching and vendor lock-in

Most internet users are already using other highly engaging alternatives. So why
should they consider Soir a viable option? It reminds me of two things. First,
despite significant momentum against WhatsApp, users didn't opt for Signal.
Second is a [tweet from Paul
Graham](https://twitter.com/paulg/status/1330086502420934657) &mdash; "In
practice, good intentions rarely work as well as good incentives." Considering
that, my situation is most definitely gloomy. My initial goal was somewhat
optimistic. I wanted to ship a functional demo to a small audience mindful of
their social media consumption. I'll let you know if I survive its first phase.

Thought of something constructive to share? Please feel free to write to me at
ashutoshgngwr[at]gmail.com.

[^1]: Pressing a like button is faster than typing a critical comment. So the
      data may not reconcile with reality, and thus inflating our inferences.
      But, we wouldn't care about the quality of the data, as long as it gives
      us the illusion of optimisation.

[^2]: Here monetisation also includes non-monetary rewards. Many users will
      settle for an increased social media reach.

[^3]: Repeated information receives a higher truth rating based on its fluency
      (the ability to unconsciously and intuitively interpret data). The
      experiments suggest that people sometimes fail to search their knowledge
      base. Instead, they rely on fluency as a proximal cue because it is
      cognitively inexpensive. See "[Knowledge does not protect against illusory
      truth [PDF]](https://www.apa.org/pubs/journals/features/xge-0000098.pdf)".

[^4]: By revisiting these echo chambers, users repeatedly expose themselves to
      resonating viewpoints. They subconsciously reinforce their existing
      beliefs to their extremities. Moreover, as their ideology becomes more
      extreme, so will the content they consume and other users in their
      proximity.

[^5]: These companies don't always use advertising. Sometimes they sell data to
      third parties (data brokers). Essentially when a software service is free,
      your data is the price.

[^6]: "In between the Internet user and the advertiser, the Journal identified
      more than 100 middlemen—tracking companies, data brokers and advertising
      networks—competing to meet the growing demand for data on individual
      behaviour and interests." &mdash; [The Web's New Gold Mine: Your Secrets
      &mdash; The Wall Street
      Journal](https://www.wsj.com/articles/SB10001424052748703940904575395073512989404).

[^7]: Using social media for social and political debates trivialises nuances of
      the discourse. "The higher the Facebook use, the more the general
      political knowledge declines." &mdash; [Criticism of Facebook -
      Wikipedia](https://en.wikipedia.org/wiki/Criticism_of_Facebook#Non-informing,_knowledge-eroding_medium).
