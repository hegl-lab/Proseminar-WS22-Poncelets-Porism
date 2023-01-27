import matplotlib.pyplot as plt
import numpy as np
import sympy

functions = open("results.txt", 'r')
lines = functions.readlines()
functions.close()

for i in range(0, len(lines)):
    print(f"========= Processing function {(i+1)} =========")
    line = lines[i]
    def function(x, y):
        return eval(line)

    delta = 0.001
    x = np.arange(-0.03, 0.52, delta)
    y = np.arange(-0.02, 0.08, delta)

    p, q = np.meshgrid(x, y)

    z = function(p, q)

    result = plt.contour(p, q, z, [0])

    paths = result.collections[0].get_paths()

    print(f"Function {(i+1)} contains {len(paths)} paths")
    output = open(f'data{(i+1)}.csv', 'w')
    for path in paths:
        vertices = path.vertices
        for vertex in vertices:
            output.write(f"{vertex[0]},{vertex[1]}\n")
        output.write("-100000,-100000\n")
    output.close()
    print(f"Wrote results to output file!")
    plt.clf()