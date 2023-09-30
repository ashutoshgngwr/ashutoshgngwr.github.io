---
layout: post
title: "Continuous integration and delivery for Android apps"
date: 2019-06-21 21:30:00 +0530
tags: android continuous-integration continuous-delivery
redirect_from: /2019/06/21/continuos-integration-and-delivery-for-android-apps
---

Recently, I created a native Android app called [Noice][noice]. It started out
as a weekend project but as I began to write it from scratch, I found so many
new things to learn. So the original goal that should have been achieved within
two to three days, ended up taking one and a half weeks.

During this time period, I focused on four different goals

- Creating a beautiful Android app to play background noises
- Getting better at writing [Kotlin][kotlin] code
- Learning about automated testing of Android components
- Setting up continuous integration and delivery to automate testing and ease
  the process of deployment

The fourth and the final goal is a topic of interest for developers in almost
every field. This post doesn't emphasise much on how to do it, rather it focuses
on the concepts and techniques involved.

## Continuous Integration

As usual, from [Wikipedia][ci-wiki]:

> In software engineering, continuous integration (CI) is the practice of
> merging all developers' working copies to a shared mainline several times a
> day.

In a nutshell, [Continuous Integration][ci-wiki] is a practice where a mainline
copy of the source code is maintained, e.g., `master` branch in a `git` repo,
and any developer who wants to make changes to mainline can acquire their own
copy, e.g., by creating a new branch in a `git` repo, and work on it. Once the
changes are made, developers need to make sure that all automated tests are
passing, and then they can merge their changes to the mainline, e.g., by
creating a pull request on GitHub.

To ensure consistent builds and agility in the workflow, it is often recommended
automating software build process along with automated testing, using an online
CI Environment such as [Travis CI][travis-ci], [Jenkins][jenkins], or [Circle
CI][circle-ci], etc.

## Continuous Delivery and Deployments

Again, from [Wikipedia][cdelivery-wiki]:

> Continuous delivery is the ability to deliver software that can be deployed at
> any time through manual releases; this is in contrast to continuous deployment
> which uses automated deployments.

Continuous Delivery is a practice where maintainers can release software using a
trigger, e.g., with a push of a button or perhaps a terminal command. To setup
[Continuous Delivery][cdelivery-wiki], Continuous Integration is a mandate.

[Continuous Deployment][cdeployment-wiki] builds on continuous delivery and
ensures automated software release with every change to mainline. There are no
explicit triggers here. Changes to mainline act as implicit triggers to ensure
complete autonomy.

Moreover, [Continuous deployments][cdeployment-wiki] are physible in projects
such as web applications where a user doesn't need to manually update the
software every time a new update is released since releases happen very often in
this scenario. Due to this, Continuous Delivery is more practical in scenarios
where the software needs to be manually updated by a user.

## Continuous Integration for Android apps

Before moving on to the good stuff, Continuous integration is required to make
sure we're not in an [integration hell][integration-hell], although it's highly
unlikely for projects of the size of [Noice][noice].

To setup Continuous Integration, I used [Travis CI][travis-ci] which is free for
open source projects. Following is a gist of configuration for the CI job used
to run automated tests, that runs on every commit to mainline.

```yaml
- stage: test
  env:
    - COVERAGE_REPORT=app/build/reports/jacoco/testDebugUnitTestCoverage/testDebugUnitTestCoverage.xml
  script: ./gradlew testDebugUnitTestCoverage
  after_success: bash <(curl -s https://codecov.io/bash) -f "$COVERAGE_REPORT"
```

- **Line 1:** Specifies which stage is this in the whole CI pipeline.
- **Line 2, 3:** Tells Travis CI to set an environment variable. In this case,
  the exported variable reflects the path at which the [code
  coverage][code-coverage] report will be generated.
- **Line 4:** Tells Travis what script to run. In this case, it is to run
  automated tests using the [Gradle][gradle] build tool.
- **Line 5:** Uploads the generated [code coverage][code-coverage] report to a
  hosted service called [CodeCov][codecov].

With the above configuration, Travis runs automated unit tests for every change
that is made to the mainline branch. If any test case is failing, Travis reports
it back to the developer in order to fix it. You can check out the sample output
of some failing test cases [here][travis-test-job-log] and test cases themselves
[here][noice-tests]!

I chose not to include a build job in my CI pipeline to get faster results
because running automated tests on Android applications implicitly builds a test
APK. But it doesn't mean that you should do this too!

## Continuous Delivery for Android apps

Like I said before, continuous deployments are not very practical in
environments where users manually need to update the software. For this reason
alone, I chose to work with Continuous Delivery in this project.

To setup Continuous Delivery, the first thing I did was to set up a fresh job in
Travis CI that uses [Fastlane][fastlane] to build and push APK to the Play
Store.

### Fastlane

[Fastlane][fastlane] is a tool from Google to build Android or iOS apps and
deploy them to App Store or Play Store with a single command. Of course, it
needs its own configuration to perform these actions but it is fairly straight
forward. Its documentation has a dedicated section on [setting it up for Android
deployments][fastlane-android-docs].

In addition to building applications, [Fastlane][fastlane] can also be
configured to automatically capture screenshots from apps and upload them to
respective stores. I chose not to use this option because it required a lot of
change in my existing setup and screenshots for [Noice][noice] aren't supposed
to change very often.

I'm leaving out the install and setup instructions. Here's the `Fastfile`

```txt
default_platform(:android)

  platform :android do
  desc "Deploy a new beta version to the Google Play"
  lane :beta do
    gradle(task: "clean bundleRelease")
    upload_to_play_store(
      track: 'beta',
      skip_upload_metadata: true,
      skip_upload_images: true,
      skip_upload_screenshots: true
    )
  end

  desc "Deploy a new production version to the Google Play"
  lane :production do
    upload_to_play_store(
      track: 'beta',
      track_promote_to: 'production',
      skip_upload_metadata: true,
      skip_upload_images: true,
      skip_upload_screenshots: true
    )
  end

end
```

First lane, `beta`, uses a [Gradle][gradle] task to build the **signed** Android
app. And then it uses Fastlane's [`upload_to_playstore`][fastlane-utp-docs]
action to perform the deployment. The app is signed using [Gradle][gradle] and
not [Fastlane][fastlane].

The second lane, `production`, doesn't build any binaries. Instead, it promotes
the latest beta version present on the Play Store to production using the
`track_promote_to` parameter of [`upload_to_playstore`][fastlane-utp-docs]
action.

### Configuring the deployment job for Travis

My Travis configuration for `deployment` job was fairly simple given
[Fastlane][fastlane] did all the heavy lifting of uploading built binaries to
the Play Store.

```yaml
- stage: deploy
  env:
    - secure: "..."
    - secure: "..."
    - secure: "..."
  before_install:
    - openssl aes-256-cbc -K $encrypted_00dbe7dde1b1_key -iv $encrypted_00dbe7dde1b1_iv -in secrets.tar.enc -out secrets.tar -d
    - tar xvf secrets.tar
    - gem update --system
    - gem install bundler
  install:
    - bundle install
  before_script:
    - export TRACK=beta
    - if [ -z "$(echo $TRAVIS_TAG | grep -P '^\d+\.\d+\.\d+-\w+$')" ]; then export TRACK=production; fi
  script: bundle exec fastlane $TRACK
  after_script: rm keystore.jks service-account-key.json secrets.tar
```

- **Line 2-5:** Encrypted environment variables that contain passwords for
  certificate that is used by [Gradle][gradle] to sign built Android app
- **Line 7, 8:** Decrypts an encrypted `tar` archive that holds the signing
  certificate and a [Google Service Account key][google-sa-keys] to be used by
  Fastlane.
- **Line 9, 10, 12:** Installs Fastlane in Travis environment
- **Line 14, 15:** Figures out whether the current release is a beta release
  (_explained later_).
- **Line 16:** Uses Fastlane to build the Android app and perform deployment
- **Line 17:** Cleans up secure files

Above deployment job only runs if the Travis build was triggered when a `git
tag` was pushed to GitHub. You may want to check out the [full Travis
configuration][full-travis-conf] for the sake of clarity.

### Release Trigger

As I mentioned before, Continuous Delivery needs an explicit trigger to perform
deployments. In [Noice][noice], I used `git tags` as release triggers.

Whenever I want to release a new version of [Noice][noice] to the Play Store, I
create a new `tag` using `git tag` command, push it to GitHub and then Travis
starts the CI pipeline to perform all the necessary actions.

I use the `0.0.0-rc` format in tag names to release the current version to beta
users. Here, `rc` means Release Candidate. `0.0.0` format is for releasing to
production. This is what Line 14 and 15 determine in deployment job.

## Conclusion

No matter what kind of project you're working on, the concepts of Continuous
Integration, Delivery, and Deployments are the same. Same CI tools are employed
to perform all the actions, just with different build tools.

If you still have a few minutes to spare, please check out [Noice on
GitHub][noice-gh]. If you like what you see, give it a thumbs-up. Alternatively,
you can also rate it on the [Play Store][noice-play-store].

[noice]: https://ashutoshgngwr.github.io/noice
[kotlin]: https://kotlinlang.org/
[ci-wiki]: https://en.wikipedia.org/wiki/Continuous_integration
[travis-ci]: https://en.wikipedia.org/wiki/Travis_CI
[jenkins]: https://jenkins.io/
[circle-ci]: https://circleci.com/
[cdelivery-wiki]: https://en.wikipedia.org/wiki/Continuous_delivery
[cdeployment-wiki]: https://en.wikipedia.org/wiki/Continuous_deployment
[integration-hell]: https://guide.freecodecamp.org/agile/integration-hell/
[code-coverage]: https://en.wikipedia.org/wiki/Code_coverage
[gradle]: https://gradle.org/
[codecov]: https://codecov.io
[noice-tests]: https://github.com/trynoice/android-app/tree/0.2.1/app/src/test/java/com/github/trynoice/android-app
[travis-test-job-log]: https://travis-ci.org/trynoice/android-app/builds/546710205#L1384
[fastlane]: https://fastlane.tools
[fastlane-android-docs]: https://docs.fastlane.tools/getting-started/android/setup/
[fastlane-utp-docs]: https://docs.fastlane.tools/actions/upload_to_play_store/
[google-sa-keys]: https://cloud.google.com/iam/docs/creating-managing-service-account-keys
[full-travis-conf]: https://github.com/trynoice/android-app/blob/0.2.1/.travis.yml
[noice-gh]: https://github.com/trynoice/android-app
[noice-play-store]: https://play.google.com/store/apps/details?id=com.github.ashutoshgngwr.noice
