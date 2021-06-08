---
layout: post
title: "Attempts at solving the online social media"
date: 2021-06-08 17:59:09 +0530
tags: default
image: false
mathjax: false
---

After graduation, I've always been mindful of my social media consumption. I had
permanently deleted Facebook and Instagram accounts. I've been keeping search
and watch histories paused on YouTube. It effectively turns off the video
recommendations. And I barely check Twitter as I find it emotionally expensive.
So last year, when [Ravi Soni](https://ravisoni.dev) proposed that we try to
solve the social media, I didn't need convincing to join him. I understood that
we were setting ourselves up for failure. But I also think that it is one of the
most urgent problems of the 21st century.

## Core problems with present social media

We started discussing what we were building sometime towards the end of August
2020\. During the discussions, we came across many problems. We focused on some
while ignoring others for the time being. For brevity, I am organising them into
a few coherent classes.

### Mental health

We are a social species. We need social validation and acceptance to thrive. The
problem occurs when we seek too much of it, and social media helps us maximise
it. Furthermore, it presents us with metrics such as the likes count. We use
these metrics to infer what others think and like about us. We optimise our
online behaviour based on our inferences and consequently exhibit narcissistic
personality traits.[^1]

Another crucial aspect is our emotional responses to our actions online. I'll
let the following excerpt from "[Criticism of Facebook &mdash;
Wikipedia](https://en.wikipedia.org/wiki/Criticism_of_Facebook)" do the talking.

> Research performed by psychologists from [Edinburgh Napier
> University](https://en.wikipedia.org/wiki/Edinburgh_Napier_University) indicated
> that Facebook
> adds [stress](https://en.wikipedia.org/wiki/Stress_%28psychological%29) to
> users' lives. Causes of stress included fear of missing important social
> information, fear of offending contacts, discomfort or guilt from rejecting
> user requests or deleting unwanted contacts or being unfriended or blocked by
> Facebook friends or other users, the displeasure of having friend requests
> rejected or ignored, the pressure to be entertaining, criticism
> or [intimidation](https://en.wikipedia.org/wiki/Intimidation) from other
> Facebook users, and having to use appropriate etiquette for different types of
> friends.

Social media helped us monetise, and so we did. We monetised our lives, kids,
pets and even our acts of kindness.[^2] If it's happening, it's happening in
front of a camera. We wouldn't have to look far to find people who display
distinct behaviour online and in real life. Everyone behaves a little different
under the scope of social media, but this distinction in behaviour is
pathological for some.

### Disinformation, filter bubbles and political influence

Disinformation is a threat in general. Although social media is an effective
tool for spreading disinformation, it can not cause the problem.[^3] Neither
does the problem have a technological solution. It is also simply not feasible
to fact-check everything we come across.

However, a bigger problem occurs when there is an information bubble. Mainstream
services employ recommender systems to generate personalised content feeds. The
system selectively guesses what information we would like to see based on our
history. While a recommender system boosts user engagement, it has a critical
side-effect. It effectively isolates us from counter viewpoints, and therefore
it can (and have) polarise us to the ideological extremes.[^4]

### Standard operating procedure for businesses

Businesses are amoral and optimise for revenue. Companies that offer software
services for free earn revenue through advertisements.[^5] To maximise their
income, they socially engineer their products to be more engaging and
advertiser-friendly. The strive for higher engagement made social media
chronically addictive. Optimal advertisement placement causes the abuse of our
private information.[^6] Social media associated a very high cost to the little
it initially promised - a tool to share personal updates with the people we
know.

## Finding solutions

After some lengthy discussions, our efforts
yielded [HymnFeed](https://hymnfeed.social/). While working on it, we also
participated in [Y Combinator's 4-week build
sprint](https://blog.ycombinator.com/announcing-yc-build-sprint-and-20-equity-free-grants/).
Although we couldn't build a functional demo in time, it had the following
fundamental features on paper.

### No influential metrics

It is perhaps the most addictive feature of the present social media. We agreed
to remove the like, comment and share counts straight away. If a user wants a
count, they could see a list of users (or comments on a post) and count
manually. Recently, [Instagram also added a feature to turn off the likes
count](https://techcrunch.com/2021/04/14/instagrams-new-test-lets-you-choose-if-you-want-to-hide-likes-facebook-test-to-follow/).

### Infinite scroll but with a natural chronology

We decided not to prioritise items in a user's content feed. Instead, we decided
to use its chronological order. Our motivation here was to avoid all
possibilities of creating filter bubbles. We did not want to guess what a user
might like; we wanted them to decide it.

### Consumable post tokens

It was a way of limiting the amount of content a user generates on the network.
Ravi came up with the concept of consumable tokens that can't be earned or
purchased. We'd offer these straight up when a user joins. They would consume
these tokens by adding their content (posts) to the network. On spending their
tokens, they would not be able to share any more content.

## Losing hope

We addressed most of the problems we were trying to solve. Yet, we couldn't
figure out a way to monetise the product. Advertisement based business models
only work with highly engaging products. What we had was inherently dull in
contrast to present social media. We could try to boost its user engagement, but
for us, that meant creating another Facebook, so it was pointless. By the end of
September 2020, we decided to pull the plug on HymnFeed. Ravi moved on to work
at [SuperTokens](https://supertokens.io/) while I shifted my focus to a
different project.

## Starting over from scratch

Some time towards the end of November 2020, I rebooted the project from scratch
as [Soir](https://getsoir.com/). I carried forward the ideas we had discussed so
far. But before considering these ideas, I started with the very basics.

### Establishing boundaries

The free flow of information is necessary for a society. But social media
shouldn't be the tool for propagating socio-political information.[^7] Instead,
such opinions should be limited to the circles where they can cause a friendly
debate, i.e. among the people we know. If one decides to expand their audience,
they can seek other media where only the interested audience is likely to enter,
e.g. blogs. Soir had WhatsApp like contact synchronisation to emulate this
model. If a person is not in your contacts, you will not interact with them on
the network. You can only view their profiles and exchange comments through a
mutual friend's post.

### Replacing the like count with the view count

Should I care who likes something that I posted on social media? In an ideal
world, I shouldn't even need the view count. However, I decided to keep the view
count. I believe it can help in sensing the audience response similar to the
like count. And that too without causing too much dopamine secretion.

### Reconsidering consumable post tokens

Unlike HymnFeed, I was planning to add two content feeds in Soir. One dedicated
for content from the contacts. And another one for hosting the public content.
Posting on the public feed would require consumable tokens, whereas reaching out
to your contacts wouldn't.

## Am I still working on Soir?

I was until mid-March. I have a semi-finished product demo. I stopped working on
the demo because of the two dreadful questions that killed HymnFeed.

### How will it make money?

I don't have a concrete answer as of now. For a long time, I didn't even have an
answer. At one point, I was considering a subscription-based service model, but
free social media have become a standard. Besides, who'd want to pay for a dull
social media service? I am exploring some alternative models, but everything is
purely theoretical at this point.

### The cost of switching and vendor lock-in

Why should users consider it a viable option if they and their contacts are
already using other highly engaging alternatives? It reminds me of two things:
Signal vs WhatsApp and a [tweet from Paul
Graham](https://twitter.com/paulg/status/1330086502420934657) &mdash; "In
practice, good intentions rarely work as well as good incentives." Despite a
significant momentum against WhatsApp, users didn't opt for Signal. Considering
that, my situation is most definitely gloomy. My initial goal was somewhat
optimistic: build a demo and find an audience mindful of their social media
consumption. I'll let you know if I survive its first phase.

Thought of something constructive to share? Please feel free to write to me at
ashutoshgngwr[at]gmail.com.

[^1]: Pressing a like button is faster than typing a critical comment. So the
      data may not reconcile with reality, and thus inflating our inferences.
      But, we wouldn't care about the quality of the data, as long as it helps
      us optimise.

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
      extreme, so will the content they consume and the users in their online
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
