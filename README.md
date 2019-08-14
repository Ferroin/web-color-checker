# Web Color Checker

This is a tool for designers and web developers to aid in choosing color
themes for their web apps.  It lets you specify a background color and a
number of theme colors, then provides a side-by-side comparison of each
color combination, as well as giving information about contrast ratios
and providing samples of what the color comparisons might look like for
individuals with various forms of color blindness.  Once you've got the
colors you want, it lets you generate a CSS, SASS, or LESS stub that
you can include in your project to define the colors.

## Contrast Ratios

Contrast ratios are computed using the algorithm defined by the Web
Content Accessibility Guidelines. The calculation assumes an sRGB color
space. This should be accurate enough for screen presentation, but is
likely to be at least a little bit wrong if you're targeting print media.

The WCAG recommendation is to have a contrast ratio of at least 4.5 for
colors that need to be differentiated from each other, and ideally a
ratio of 7 or better.

## Color Blindness Simulation

The color blindness simulation is done using the HCIRN Color Blindness
Simulation function. Like most simulations of color blindness, it's
generally accepted as not being accurate, but is considered to be good
enough as a basic guideline to not matter.  Keep in mind that it simulates
apparent _similarity_ of colors, not the way a color blind individual
will perceive those colors.

We simulate the extreme forms of the three different types of single
color blindness (protanopia, deuteranopia, and tritanopia), as well as
total color blindness (though we don't display that by default, because
it's rare enough to not matter for most cases).

Roughly 8% of the world population has some form of at least partial
color blindness (in contrast, the most populous city in the world right
now (Tokyo) accounts for about 0.4% of the world population), so unless
you're dealing with a miniscule percentage of the population, you should
make a point to care about it.  The same contrast guidelines apply here,
though it's worth considering spearate themes for color blindness.

## Usage

This should work just fine in almost any web browser released after
about 2015.  Note that this does not include Internet Explorer or Opera
Mini, if you're still using them, you're out of luck (and no, I will
not accept PR's to add support for them, feel free to fork the project
if you want such support).

### Adding Colors

Just hit the plus button on the top right to add another color to the
set for comparison.

### Removing Colors

To remove a color from the set, just click the 'X' button on the top
right of the card for that color.

### Color names

Each color card except the first one allows you to specify a name
using the input at the top of the card.  The input is hard-coded to
only accept characters that could be in a CSS class or property name
(this includes the upper and lowercase  letters A-Z, the digits 0-9,
dash, and underscore).

### Changing what color-blindness types are simulated

You can change which types of color blindness are simulated in the color
cards and the comparison cards by opening the menu in the top left and
selecting 'settings'.

### Generating Style Code

Open the menu in the top left and select 'code' to get pre-generated CSS,
SASS, or LESS code for the colors you currently have selected.

The CSS code can be either a set of custom properties on the root
element, or a series of classes that automatically set the background
and text colors.

The SASS code is a single variable called `$colors` that provides a
mapping of color names to values.

The LESS code is a set of variables mapping color names to values.

### Sharing Color Sets

The URL gets updated automatically to encode all the relevant information
about your currently defined set of colors, so if you want to show someone
else the same selection of colors (or view it on a different device),
you can just send the URL.

Be careful loading URL's from people who you don't trust, I am not an
expert at security.  I _think_ that this is all reasonably safe, but
I'm not a security expert, so I may have missed something (the worst
that should happen is that the page doesn't load).

## Examples

Replace the end of the URL with the following to see an approximation
of the default theme from Bootstrap 4:

    #P;____AAAA;AHv_____Primary;bHV9____Secondary;KKdF____Success;F6K4____Info;_8EHAAAAWarning;3DVF____Danger;-Pn6AAAALight;NDpA____Dark;

## FAQ

### Why do you list deuteranopia first in the color blindness simulations?
Because while deuteranopia itself is not the most common form of color
blindness, deuteranomaly (the partial form of deuteranopia) is more
common than every other type of color blindness combined. Because
targeting good contrast for deuteranopia also gets you reasonably
good contrast for deuteranomaly, it should be the first type of color
blindness to consider.

### Why not just use some existing tool?
Because I couldn't find one that covered what I wanted, and I could
use the experience with JavaScript.

### Why is it so ugnly?
Function over form. A tool doesn't have to look nice to do it's job,
and I'm a whole lot more worried about this one doing it's job than
looking nice.

### Why in the world are you still using jQuery?
Because Bootstrap depends on it.

### Why in the world are you still using Bootstrap?
Because I'd rather not waste time writing styles, and the overhead
introduced by using Bootstrap just isn't enough to matter here.

### Why didn't you write it in React/Angular/Vue/\<insert-framework-here\>?
Because this is so trivially simple that I would have spent more time
working on the framework than actually writing the app. Application
frameworks are great when you've got a huge, 100k plus line application
that needs bunches of features, but this one is just too simple for it
to matter.
