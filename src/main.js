import * as d3 from 'd3';

import createDraw from './draw';
import createHist from './hist';
import createSwarm from './swarm';

import '../index.html';
import './style';

const draw = createDraw();

function pullOutDogs(dogCat) {
  const dogDrawings = d3.keys(dogCat.dog.drawings)
    .map((key) => {
      const dr = dogCat.dog.drawings[key][0];
      dr.time = key;
      return dr;
    });
  return [{ key: 'dog', drawings: dogDrawings }];
}


function displaySmallMults(error, birds, bugs, shapes) {
  // bird histogram
  createHist()
    .histKey('hist')
    .showAvg(true)
    .showDrawings(true)
    .xDomain([0, 20])
    .width(200)
    .height(200)
    .keys(null)
    .drawingsKey('drawings')
    .overlap(false)('#birds', '#birds-draw', birds);

  createHist()
    .xDomain([0, 20])
    .showDrawings(true)
    .width(200)
    .height(200)
    .keys(null)
    .overlap(false)('#bugs', '#bugs-draw', bugs);

  createHist()
    .xDomain([0, 20])
    .showDrawings(true)
    .width(200)
    .height(200)
    .keys(null)
    .overlap(false)('#shapes', '#shapes-draw', shapes);
}

function displaySwarm(error, stats) {
  const swarm = createSwarm()
  swarm('#swarm', '#swarm-draw', stats);

  d3.select('#swarm-select').on('change', function() {
    swarm.switch(this.value);
  });
}

function display(error, dogCat) {
  console.log(error);

  const dogDrawings = pullOutDogs(dogCat);
  draw.limit(14).showTitle(false).animate(true)('#dogs-title');
  draw.drawings(dogDrawings);

  // dog-cat histogram
  createHist().xDomain([0, 20]).keys(['dog'])('#dog-hist', '#dog-draw', dogCat);
  createHist().xDomain([0, 20]).keys(['dog', 'cat'])('#dogcat-hist', '#dogcat-draw', dogCat);
  createHist().xDomain([0, 20]).keys(['dog', 'cat', 'horse'])('#dogcathorse-hist', '#dogcathorse-draw', dogCat);

  createHist()
    .histKey('hist_stroke')
    .xDomain([0, 24])
    .showAvg(false)
    .showDrawings(true)
    .drawingsKey('drawings_strokes')
    .keys(['dog', 'cat', 'horse'])('#dogcathorse-strokes', '#dogcathorse-strokes-draw', dogCat);

  createHist()
    .histKey('hist_stroke')
    .xDomain([0, 24])
    .width(260)
    .height(200)
    .showAvg(false)
    .overlap(false)
    .showDrawings(true)
    .drawingsKey('drawings_strokes')
    .keys(['dog', 'cat', 'horse'])('#dogcathorse-strokes-small', '#dogcathorse-strokes-draw', dogCat);
}

d3.queue()
  .defer(d3.json, 'data/dog_cat_horse_out.json')
  .await(display);

d3.queue()
  .defer(d3.json, 'data/bird_flamingo_owl_duck_out.json')
  .defer(d3.json, 'data/ant_mosquito_butterfly_scorpion_out.json')
  .defer(d3.json, 'data/circle_squiggle_triangle_square_out.json')
  .await(displaySmallMults);

d3.queue()
  .defer(d3.json, 'data/all_aggregates_with_doodles.json')
  .await(displaySwarm);
