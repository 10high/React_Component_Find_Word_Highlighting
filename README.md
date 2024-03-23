<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<h3 align="center">React Component Find Word Highlighting</h3>

  <p align="center">
    A Text Area that highlights instances of a word or regular expression match
    <br />
    <a href="https://github.com/10high/React_Component_Find_Word_Highlightingrepo_name"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/10high/React_Component_Find_Word_Highlighting/issues">Report Bug</a>
    ·
    <a href="https://github.com/10high/React_Component_Find_Word_Highlighting/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This React component can simply be copied into your existing project and accepts the following props:

```javascript
<TextAreaWithFindHighlighting
  wordToHighlight="string"
  isCaseSensitive={true}
  textAreaFormDataName="string"
  useRegularExpression={false}
/>
```

The following styles can be configured easily at the top of the component file `TextAreaWithFindHighlighting.tsx` like so:

```javascript
const configureStyles = {
  textArea: {
    margin: "8px",
    padding: "8px",
    border: "solid 1px black",
    borderRadius: "0px",
    lineHeight: "1.2",
    fontSize: "1rem",
    width: "50%",
    height: "200px",
  },
  textSelection: {
    color: "white",
    backgroundColor: "cornflowerblue",
  },
  wordFindHighlighting: {
    color: "red",
  },
};
```

- All user input is treated as data.
- No `innerHTML` is used.
- Only the word to find or the regular expression match is wrapped in an `<span>` element that applies the defined font color.

The component is a `<textarea>` element with `opacity` set to 0 and a `<div>` element placed beneath it at a lower `z-index`to display the styled text.

The component renders twice on each change. The second render is solely to flip the caret animation so that it imitates real caret behavior.
If you don't care about about that and want to save yourself a render, you can remove the `useEffect` in the `Output.tsx` file.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![React][React.js]][React-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

- Download and extract the zip file `TextAreaWithFindHighlighting.zip` from the repository root.
- Place the component directory in your project directory tree.
- Import the component `TextAreaWithFindHighlighting` as needed.
- Configure the props as shown in the example above.
- Configure they styling as shown in the example above.

### Prerequisites

This component is written in Typescript.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [ ] Testing with vitest

See the [open issues](https://github.com/10high/React_Component_Find_Word_Highlighting/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Project Link: [https://github.com/10high/React_Component_Find_Word_Highlighting](https://github.com/10high/React_Component_Find_Word_Highlighting)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [ Best-README-Template
  ](https://github.com/othneildrew/Best-README-Template/tree/master)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/10high/React_Component_Find_Word_Highlighting.svg?style=for-the-badge
[contributors-url]: https://github.com/10high/React_Component_Find_Word_Highlighting/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/10high/React_Component_Find_Word_Highlighting.svg?style=for-the-badge
[forks-url]: https://github.com/10high/React_Component_Find_Word_Highlighting/network/members
[stars-shield]: https://img.shields.io/github/stars/10high/React_Component_Find_Word_Highlighting.svg?style=for-the-badge
[stars-url]: https://github.com/10high/React_Component_Find_Word_Highlighting/stargazers
[issues-shield]: https://img.shields.io/github/issues/10high/React_Component_Find_Word_Highlighting.svg?style=for-the-badge
[issues-url]: https://github.com/10high/React_Component_Find_Word_Highlighting/issues
[license-shield]: https://img.shields.io/github/license/10high/React_Component_Find_Word_Highlighting.svg?style=for-the-badge
[license-url]: https://github.com/10high/React_Component_Find_Word_Highlighting/blob/main/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/michael-waaler-55854717
[product-screenshot]: images/screenshot.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
