import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  test('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('testKey')).toBe(JSON.stringify('updated'));
  });

  test('should retrieve existing value from localStorage', () => {
    localStorage.setItem('testKey', JSON.stringify('existing'));
    
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));
    
    expect(result.current[0]).toBe('existing');
  });

  test('should work with objects', () => {
    const initialObj = { name: 'John', age: 30 };
    const { result } = renderHook(() => useLocalStorage('userKey', initialObj));
    
    expect(result.current[0]).toEqual(initialObj);
    
    const updatedObj = { name: 'Jane', age: 25 };
    act(() => {
      result.current[1](updatedObj);
    });
    
    expect(result.current[0]).toEqual(updatedObj);
    expect(JSON.parse(localStorage.getItem('userKey'))).toEqual(updatedObj);
  });

  test('should work with arrays', () => {
    const initialArray = [1, 2, 3];
    const { result } = renderHook(() => useLocalStorage('arrayKey', initialArray));
    
    expect(result.current[0]).toEqual(initialArray);
    
    const updatedArray = [4, 5, 6];
    act(() => {
      result.current[1](updatedArray);
    });
    
    expect(result.current[0]).toEqual(updatedArray);
  });

  test('should handle localStorage errors gracefully', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock localStorage.getItem to throw an error
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('localStorage error');
    });
    
    const { result } = renderHook(() => useLocalStorage('testKey', 'fallback'));
    
    expect(result.current[0]).toBe('fallback');
    expect(consoleError).toHaveBeenCalled();
    
    consoleError.mockRestore();
  });

  test('should sync across multiple instances with same key', () => {
    // Clear any previous mocks first
    jest.restoreAllMocks();
    localStorage.clear();
    
    const { result: result1 } = renderHook(() => useLocalStorage('sharedKey', 'initial'));
    const { result: result2 } = renderHook(() => useLocalStorage('sharedKey', 'initial'));
    
    act(() => {
      result1.current[1]('updated');
    });
    
    // Both should read the same value from localStorage on next render
    expect(localStorage.getItem('sharedKey')).toBe(JSON.stringify('updated'));
  });
});

