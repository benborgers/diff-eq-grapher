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

# Create the figure and plot the phase plane
plt.figure(figsize=(8, 6))
plt.quiver(X, Y, U, V, color='#ccc')
plt.xlabel('x')
plt.ylabel('y')
# plt.title(f'Phase Plane Plot at t={T}')
plt.xlim([xMin, xMax])
plt.ylim([yMin, yMax])
plt.grid()

# Plot trajectories for different starting points and times
for point in payload['points']:
    tspan = np.linspace(0, 50, 5000)  # time span for the ODE solver
    ys = odeint(system, point, tspan)

    plt.plot(ys[:,0], ys[:,1], 'k')  # path line
    plt.plot([ys[0,0]], [ys[0,1]], 'o') # start point
    # plt.plot([ys[-1,0]], [ys[-1,1]], 's') # end point

# plt.show()
plt.savefig(payload['destination'], dpi=300)