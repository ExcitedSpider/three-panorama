import { useState, useEffect, PointerEventHandler } from "react";
import useConstant from "use-constant";
import {
  fromEvent,
  Subject,
  map,
  Observable,
  takeUntil,
  BehaviorSubject,
  withLatestFrom,
} from "rxjs";

export function useDrag(): [PointerEventHandler, [number, number]] {
  const [reactValue, setReactValue] = useState<[number, number]>([0, 0]);

  /** observerables */
  const event$ = useConstant(() => new Subject<React.PointerEvent>());
  const state$ = useConstant(
    () => new BehaviorSubject<[number, number]>([0, 0])
  );

  const pressHandler: PointerEventHandler = (event) => {
    event$.next(event);
    state$.next(getCoords(event));
  };

  useEffect(() => {
    const startStream = event$.pipe(map(getCoords));

    startStream.subscribe(() => {
      const moveStream = (
        fromEvent(window, "pointermove") as Observable<PointerEvent>
      ).pipe(map(getCoords), takeUntil(fromEvent(window, "pointerup"),), withLatestFrom(state$));

      moveStream.subscribe(([cur, prev])=>{
        const newValue = [prev[0] - cur[0] , cur[1] - prev[1]] as [number, number];
        setReactValue(newValue)

        state$.next(cur);
      })
    });

  }, []);

  return [pressHandler, reactValue];
}

const getCoords = (event: { clientX: number; clientY: number }) =>
  [event.clientX, event.clientY] as [number, number];
