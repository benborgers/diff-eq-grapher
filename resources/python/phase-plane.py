import sys
import json
import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import odeint
from sympy.parsing.sympy_parser import parse_expr
from sympy import symbols, lambdify, E, pi

payload = json.loads(sys.argv[1])
equation1 = payload['equation1']
equation2 = payload['equation2']
xMin = float(payload['xMin'])
xMax = float(payload['xMax'])
yMin = float(payload['yMin'])
yMax = float(payload['yMax'])

x_symbol, y_symbol, t_symbol = symbols('x y t')

clean_expr_1 = parse_expr(equation1, local_dict={'e': E, 'π': pi}, transformations='all')
func_1 = lambdify((x_symbol, y_symbol, t_symbol), clean_expr_1, 'numpy')

clean_expr_2 = parse_expr(equation2, local_dict={'e': E, 'π': pi}, transformations='all')
func_2 = lambdify((x_symbol, y_symbol, t_symbol), clean_expr_2, 'numpy')

# Define the system of differential equations with time dependency
def system(y, t):
    # y is a vector; y[0] is x, y[1] is y
    x, y = y

    # Example: differential equations with time-dependency
    # dxdt = np.sin(t) - x*y
    # dydt = np.cos(t) - x*y

    return [func_1(x, y, t), func_2(x, y, t)]

def inverted_system(y, t):
    x, y = system(y, t)
    return [-x, -y]

# Create a grid and compute direction at each point
Y, X = np.mgrid[yMin:yMax:20j, xMin:xMax:20j]
U, V = np.zeros(Y.shape), np.zeros(X.shape)
T = 0  # The time 'T' at which to evaluate the direction fields

for i in range(X.shape[0]):
    for j in range(Y.shape[1]):
        x = X[i, j]
        y = Y[i, j]
        dxdt, dydt = system([x, y], T)
        U[i,j] = dxdt
        V[i,j] = dydt

# Normalize the arrows
N = np.sqrt(U**2 + V**2)
U = U/N
V = V/N

# Compute the aspect ratio and adjust the arrows accordingly
# (this compensates for the fact that the x and y axes have different scales)
xRange = xMax - xMin
yRange = yMax - yMin
aspect_ratio = yRange / xRange
V = V / aspect_ratio

# Create the figure and plot the phase plane
plt.figure(figsize=(8, 6))
plt.quiver(X, Y, U, V, color='#ccc')
plt.xlabel('x')
plt.ylabel('y')
# plt.title(f'Phase Plane Plot at t={T}')
plt.xlim([xMin, xMax])
plt.ylim([yMin, yMax])
plt.grid()

tspan = np.linspace(0, 150, 5000)

# Plot trajectories for different starting points and times
for point in payload['points']:
    ys = odeint(system, point, tspan)
    ys_inverted = odeint(inverted_system, point, tspan)

    plt.plot([ys[0,0]], [ys[0,1]], 'o') # start

    valid_points = []
    for y in ys:
        if xMin <= y[0] <= xMax and yMin <= y[1] <= yMax:
            valid_points.append(y)
        else:
            valid_points.append(y) # add the last point out of bounds
            break # stop as soon as we go out of bounds
    valid_points = np.array(valid_points)
    if len(valid_points) > 0:
        plt.plot(valid_points[:,0], valid_points[:,1], 'k')

    valid_points_inverted = []
    for y in ys_inverted:
        if xMin <= y[0] <= xMax and yMin <= y[1] <= yMax:
            valid_points_inverted.append(y)
        else:
            valid_points_inverted.append(y) # add the last point out of bounds
            break # stop as soon as we go out of bounds
    valid_points_inverted = np.array(valid_points_inverted)
    if len(valid_points_inverted) > 0:
        plt.plot(valid_points_inverted[:,0], valid_points_inverted[:,1], 'k')

plt.savefig(payload['destination'], dpi=300)


# x-t and y-t graph

def find_max_t (ys, min_num, max_num):
    return min(
        np.argmax(ys[:, 0] >= max_num) if np.any(ys[:, 0] >= max_num) else len(ys),
        np.argmax(ys[:, 1] >= max_num) if np.any(ys[:, 1] >= max_num) else len(ys)
    )


# x-t graph

plt.figure(figsize=(10, 4))
plt.xlabel('t')
plt.ylabel('x')
plt.grid()

for point in payload['points']:
    ys = odeint(system, point, tspan)

    # Find the index where ys[:, 0] first exceeds or equals xMax
    # If ys[:, 0] never reaches xMax, we use all the points
    index_limit = find_max_t(ys, xMin, xMax)

    plt.plot(tspan[:index_limit], ys[:index_limit, 0], lw=2)

plt.title('x-t graph')
plt.tight_layout()
plt.ylim([xMin, xMax])

plt.savefig(payload['xt_destination'], dpi=300)


# y-t graph

plt.figure(figsize=(10, 4))
plt.xlabel('t')
plt.ylabel('y')
plt.grid()

for point in payload['points']:
    ys = odeint(system, point, tspan)

    index_limit = find_max_t(ys, yMin, yMax)

    plt.plot(tspan[:index_limit], ys[:index_limit, 1], lw=2)

plt.title('y-t graph')
plt.tight_layout()
plt.ylim([yMin, yMax])

plt.savefig(payload['yt_destination'], dpi=300)
