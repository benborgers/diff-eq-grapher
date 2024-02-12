# Differential Equation Grapher

Interesting files:

-   [`Graph.php`](https://github.com/benborgers/diff-eq-grapher/blob/main/app/Http/Controllers/Graph.php)
-   [`graph.py`](https://github.com/benborgers/diff-eq-grapher/blob/main/resources/python/graph.py)
-   [`GraphPhasePlane.php`](https://github.com/benborgers/diff-eq-grapher/blob/main/app/Http/Controllers/GraphPhasePlane.php)
-   [`phase-plane.py`](https://github.com/benborgers/diff-eq-grapher/blob/main/resources/python/phase-plane.py)

## Deployment

Set up the Python aspect of the server like this:

Make a folder `resources/python` and `cd` into it.

```bash
cd resources/python
mkdir -p public
python3 -m venv venv
source venv/bin/activate
pip install numpy scipy matplotlib sympy
```
