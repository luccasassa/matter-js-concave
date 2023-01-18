var matterContent = document.querySelector("#matter-content");

var Example = Example || {};

Example.concave = (function () {
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Vertices = Matter.Vertices,
    Bodies = Matter.Bodies;

  // create engine
  var engine = Engine.create(),
    world = engine.world;

  // create renderer
  var render = Render.create({
    element: matterContent,
    engine: engine,
    options: {
      width: 800,
      height: 600,
    },
  });

  Render.run(render);

  // create runner
  var runner = Runner.create();
  Runner.run(runner, engine);

  // add bodies
  World.add(world, [
    // walls
    Bodies.rectangle(500, -59, 1000, 30, { isStatic: true }),
    Bodies.rectangle(500, 659, 1000, 30, { isStatic: true }),
    Bodies.rectangle(984, 300, 30, 1000, { isStatic: true }),
    Bodies.rectangle(16, 300, 30, 1000, { isStatic: true }),
  ]);

  var arrow = Vertices.fromPath("0 0 0 50 0 0 50 50 50 0")/* ,
    chevron = Vertices.fromPath("0 0 75 50 100 100 25 100 0 50 25 0"),
    star = Vertices.fromPath(
      "50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38"
    ); */

  var stack = Composites.stack(50, 0, 600, 3, 5, 10, function (x, y) {
    var color = Common.choose([
      "#556270",
      "#4ECDC4",
      "#C7F464",
      "#FF6B6B",
      "#C44D58",
    ]);

    return Bodies.fromVertices(
      x,
      y,
      Common.choose([arrow]),
      {
        render: {
          fillStyle: color,
          strokeStyle: color,
          lineWidth: 1,
        },
      },
      true
    );
  });

  World.add(world, stack);

  // add mouse control
  var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

  World.add(world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 1000, y: 600 },
  });

  // context for MatterTools.Demo
  return {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    stop: function () {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    },
  };
})();
